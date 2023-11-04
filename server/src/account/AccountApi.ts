import { requiredString } from "../common/Validators";
import type { Player } from "../player/model/Player";
import type { Session } from "../session/model/Session";
import {
  accountRegistrationService,
  type AccountRegistrationService,
} from "./AccountRegistrationService";
import { loginService, type LoginService } from "./LoginService";

export interface AccountRegisterRequest {
  username: string;
  password: string;
  nick: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export class AccountApi {
  constructor(
    private accountRegistrationService: AccountRegistrationService,
    private loginService: LoginService
  ) {}

  async registerAccount({
    username,
    password,
    nick,
  }: AccountRegisterRequest): Promise<void> {
    requiredString(username, 3, 30, "invalidUsername");
    requiredString(password, 12, 100, "invalidPassword");
    requiredString(nick, 3, 20, "invalidNick");

    await this.accountRegistrationService.registerAccount({
      username,
      password,
      nick,
    });
  }

  async login(
    { username, password }: LoginRequest,
    session: Session
  ): Promise<Player> {
    requiredString(username, 3, 30, "invalidUsername");
    requiredString(password, 12, 100, "invalidPassword");

    await this.loginService.login(session, username, password);

    return session.player!;
  }
}

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService
);
