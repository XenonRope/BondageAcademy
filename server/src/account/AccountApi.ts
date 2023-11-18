import { requiredString } from "../common/Validators";
import { type PlayerStoreService } from "../player/PlayerStoreService";
import {
  mapToPlayerForClient,
  type PlayerForClient,
} from "../player/model/Player";
import type { Session } from "../session/model/Session";
import { type WorldObjectSynchronizationService } from "../world/WorldObjectSynchronizationService";
import { type WorldObjectForClient } from "../world/model/WorldObject";
import { type AccountRegistrationService } from "./AccountRegistrationService";
import { type LoginService } from "./LoginService";

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
    width: number;
    height: number;
    objects: WorldObjectForClient[];
  };
}

export class AccountApi {
  constructor(
    private accountRegistrationService: AccountRegistrationService,
    private loginService: LoginService,
    private worldObjectSynchronizationService: WorldObjectSynchronizationService,
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
      player: mapToPlayerForClient(await this.playerStoreService.get(playerId)),
      world: {
        width: world.width,
        height: world.height,
        objects:
          await this.worldObjectSynchronizationService.mapToObjectsForClient(
            world.objects
          ),
      },
    };
  }
}
