import { BusinessError } from "../common/model/BusinessError";
import { type Player } from "../player/model/Player";
import { playerService, type PlayerService } from "../player/PlayerService";
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
    private playerService: PlayerService,
    private sessionService: SessionService,
    private logoutService: LogoutService,
    private worldJoinService: WorldJoinService
  ) {}

  async login(
    session: Session,
    username: string,
    password: string
  ): Promise<World> {
    const account = await this.accountService.getAccountByUsernameAndPassword(
      username,
      password
    );
    if (account == null) {
      throw new BusinessError("incorrectUsernameOrPassword");
    }

    const player = await this.playerService.getPlayer(account.playerId);
    if (player == null) {
      throw new BusinessError("accountDoesNotHavePlayer");
    }

    const otherSessionForSamePlayer = this.sessionService.getSessionByPlayerId(
      player.id
    );
    if (otherSessionForSamePlayer != null) {
      this.logoutService.logout(otherSessionForSamePlayer);
    }

    session.account = account;
    session.player = player;

    const { world, playerObject } = await this.joinWorld(session, player);

    session.world = world;
    session.playerObject = playerObject;

    return world;
  }

  private async joinWorld(
    session: Session,
    player: Player
  ): Promise<{ world: World; playerObject: PlayerObject }> {
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
  playerService,
  sessionService,
  logoutService,
  worldJoinService
);
