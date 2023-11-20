import { BusinessError } from "../api/model/business-error";
import type { Session } from "../session/model/session";
import type { SessionService } from "../session/session-service";
import { type AccountService } from "./account-service";
import { type LogoutService } from "./logout-service";

export class LoginService {
  constructor(
    private accountService: AccountService,
    private sessionService: SessionService,
    private logoutService: LogoutService
  ) {}

  async login(
    session: Session,
    username: string,
    password: string
  ): Promise<{ playerId: number }> {
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

    return { playerId: account.playerId };
  }
}
