import { playerService, type PlayerService } from "../player/PlayerService";
import type { Session } from "../session/model/Session";
import { worldService, type WorldService } from "../world/WorldService";
import { accountService, type AccountService } from "./AccountService";

export class LoginService {
  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private worldService: WorldService
  ) {}

  async login(
    session: Session,
    username: string,
    password: string
  ): Promise<void> {
    const account = await this.accountService.getAccountByUsernameAndPassword(
      username,
      password
    );
    if (account == null) {
      throw new Error("incorrectUsernameOrPassword");
    }

    const player = await this.playerService.getPlayer(account.playerId);
    if (player == null) {
      throw new Error("accountDoesNotHavePlayer");
    }
    const world = await this.worldService.getWorldByRoomId(player.roomId);
    const playerObject = this.worldService.addPlayer(world, player, session);

    session.account = account;
    session.world = world;
    session.player = player;
    session.playerObject = playerObject;
  }
}

export const loginService = new LoginService(
  accountService,
  playerService,
  worldService
);
