import { BusinessError } from "../common/model/BusinessError";
import { playerService, type PlayerService } from "../player/PlayerService";
import { sessionService, type SessionService } from "../session/SessionService";
import type { Session } from "../session/model/Session";
import { worldService, type WorldService } from "../world/WorldService";
import { World } from "../world/model/World";
import { accountService, type AccountService } from "./AccountService";
import { logoutService, type LogoutService } from "./LogoutService";

export class LoginService {
  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private worldService: WorldService,
    private sessionService: SessionService,
    private logoutService: LogoutService
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

    const world = await this.worldService.getWorldByRoomId(player.roomId);
    const playerObject = this.worldService.addPlayer(world, player, session);

    session.account = account;
    session.world = world;
    session.player = player;
    session.playerObject = playerObject;

    return world;
  }
}

export const loginService = new LoginService(
  accountService,
  playerService,
  worldService,
  sessionService,
  logoutService
);
