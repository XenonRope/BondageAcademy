import { requiredString } from "../common/Validators";
import {
  mapToPlayerForClient,
  type PlayerForClient,
} from "../player/model/Player";
import type { Session } from "../session/model/Session";
import {
  worldObjectSynchronizationService,
  type WorldObjectSynchronizationService,
} from "../world/WorldObjectSynchronizationService";
import { type WorldObjectForClient } from "../world/model/WorldObject";
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

export interface LoginResponse {
  player: PlayerForClient;
  world: {
    objects: WorldObjectForClient[];
  };
}

export class AccountApi {
  constructor(
    private accountRegistrationService: AccountRegistrationService,
    private loginService: LoginService,
    private worldObjectSynchronizationService: WorldObjectSynchronizationService
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

    await this.loginService.login(session, username, password);

    return {
      player: mapToPlayerForClient(session.player!),
      world: {
        objects: this.worldObjectSynchronizationService.mapToObjectsForClient(
          session.world!.objects
        ),
      },
    };
  }
}

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService,
  worldObjectSynchronizationService
);
