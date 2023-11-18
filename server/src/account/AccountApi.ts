import type {
  AccountRegisterRequest,
  LoginRequest,
  LoginResponse,
} from "shared";
import { requiredString } from "../common/Validators";
import type { ObjectSynchronizationService } from "../object/ObjectSynchronizationService";
import type { PlayerStoreService } from "../player/PlayerStoreService";
import type { Session } from "../session/model/Session";
import type { AccountRegistrationService } from "./AccountRegistrationService";
import type { LoginService } from "./LoginService";

export class AccountApi {
  constructor(
    private accountRegistrationService: AccountRegistrationService,
    private loginService: LoginService,
    private worldObjectSynchronizationService: ObjectSynchronizationService,
    private playerStoreService: PlayerStoreService
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
  ): Promise<LoginResponse> {
    requiredString(username, 3, 30, "invalidUsername");
    requiredString(password, 12, 100, "invalidPassword");

    const { world, playerId } = await this.loginService.login(
      session,
      username,
      password
    );

    return {
      player: await this.playerStoreService.get(playerId),
      world,
    };
  }
}
