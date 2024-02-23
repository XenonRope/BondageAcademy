import { inject, singleton } from "tsyringe";
import { BusinessError } from "../api/model/business-error";
import type { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";
import { AccountService } from "./account-service";
import { LogoutService } from "./logout-service";

@singleton()
export class LoginService {
  constructor(
    @inject(AccountService)
    private accountService: AccountService,
    @inject(SessionService)
    private sessionService: SessionService,
    @inject(LogoutService)
    private logoutService: LogoutService,
  ) {}

  async login(
    session: Session,
    username: string,
    password: string,
  ): Promise<{ playerId: number }> {
    const account = await this.accountService.getAccountByUsernameAndPassword(
      username,
      password,
    );
    if (account == null) {
      throw new BusinessError("incorrectUsernameOrPassword");
    }

    const otherSessionForSamePlayer = this.sessionService.getSessionByPlayerId(
      account.playerId,
    );
    if (otherSessionForSamePlayer != null) {
      this.logoutService.logout(otherSessionForSamePlayer);
    }

    session.accountId = account.id;
    session.playerId = account.playerId;

    return { playerId: account.playerId };
  }
}
