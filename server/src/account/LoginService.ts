import { type World, type PlayerObject, RoomCode } from "shared";
import { BusinessError } from "../common/model/BusinessError";
import { type PlayerStoreService } from "../player/PlayerStoreService";
import type { SessionService } from "../session/SessionService";
import type { Session } from "../session/model/Session";
import { type WorldJoinService } from "../world/WorldJoinService";
import { type AccountService } from "./AccountService";
import { type LogoutService } from "./LogoutService";

export class LoginService {
  constructor(
    private accountService: AccountService,
    private playerStoreService: PlayerStoreService,
    private sessionService: SessionService,
    private logoutService: LogoutService,
    private worldJoinService: WorldJoinService
  ) {}

  async login(
    session: Session,
    username: string,
    password: string
  ): Promise<{ world: World; playerId: number }> {
    const account = await this.accountService.getAccountByUsernameAndPassword(
      username,
      password
    );
    if (account == null) {
      throw new BusinessError("incorrectUsernameOrPassword");
    }

    const otherSessionForSamePlayer = this.sessionService.getSessionByPlayerId(
      account.playerId
    );
    if (otherSessionForSamePlayer != null) {
      await this.logoutService.logout(otherSessionForSamePlayer);
    }

    session.accountId = account.id;
    session.playerId = account.playerId;

    const { world, playerObject } = await this.joinWorld(
      session,
      account.playerId
    );

    session.world = world;
    session.playerObject = playerObject;

    return { world, playerId: account.playerId };
  }

  private async joinWorld(
    session: Session,
    playerId: number
  ): Promise<{ world: World; playerObject: PlayerObject }> {
    const { worldId, roomId } = await this.playerStoreService.get(playerId);
    if (worldId) {
      const response = await this.worldJoinService.joinWorldById(
        session,
        worldId
      );
      if (!(response instanceof BusinessError)) {
        return response;
      }
    }

    if (roomId) {
      const response = await this.worldJoinService.joinWorldByRoomId(
        session,
        roomId
      );
      if (!(response instanceof BusinessError)) {
        return response;
      }
    }

    const response = await this.worldJoinService.joinWorldByRoomCode(
      session,
      RoomCode.Introduction
    );
    if (!(response instanceof BusinessError)) {
      return response;
    }

    throw new Error("Cannot join introduction world");
  }
}
