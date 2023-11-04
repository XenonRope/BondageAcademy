import { playerService, type PlayerService } from "../player/PlayerService";
import type { Session } from "../session/model/Session";
import { accountService, type AccountService } from "./AccountService";

export class LoginService {
  constructor(
    private accountService: AccountService,
    private playerService: PlayerService
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

    session.account = account;
    session.player = player!;
  }
}

export const loginService = new LoginService(accountService, playerService);
