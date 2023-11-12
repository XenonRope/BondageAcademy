import { BusinessError } from "../common/model/BusinessError";
import {
  playerStoreService,
  type PlayerStoreService,
} from "../player/PlayerStoreService";
import { RoomCode } from "../room/model/RoomCode";
import type { Session } from "../session/model/Session";
import { sessionService, type SessionService } from "../session/SessionService";
import { type PlayerObject } from "../world/model/PlayerObject";
import { type World } from "../world/model/World";
import {
  worldJoinService,
  type WorldJoinService,
} from "../world/WorldJoinService";
import { accountService, type AccountService } from "./AccountService";
import { logoutService, type LogoutService } from "./LogoutService";

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
      this.logoutService.logout(otherSessionForSamePlayer);
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
    const player = await this.playerStoreService.getPlayer(playerId);
    if (player.worldId) {
      const response = this.worldJoinService.joinWorldById(
        session,
        player.worldId
      );
      if (!(response instanceof BusinessError)) {
        return response;
      }
    }

    if (player.roomId) {
      const response = await this.worldJoinService.joinWorldByRoomId(
        session,
        player.roomId
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

export const loginService = new LoginService(
  accountService,
  playerStoreService,
  sessionService,
  logoutService,
  worldJoinService
);
