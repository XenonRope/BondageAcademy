import { socketService, type SocketService } from "../../common/SocketService";
import { setStore } from "../../common/Store";
import type { Player } from "../../player/model/Player";
import type { WorldObject } from "../../world/model/WorldObject";

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
  player: Player;
  world: {
    width: number;
    height: number;
    objects: WorldObject[];
  };
}

export class AccountService {
  constructor(private socketService: SocketService) {}

  async registerAccount(request: AccountRegisterRequest): Promise<void> {
    await this.socketService.emit("register_account", request);
  }

  async login(request: LoginRequest): Promise<void> {
    const response: LoginResponse = await this.socketService.emit(
      "login",
      request,
    );
    const objects: Record<number, WorldObject> = {};
    response.world.objects.forEach((object) => (objects[object.id] = object));
    setStore({
      player: response.player,
      world: {
        width: response.world.width,
        height: response.world.height,
        objects,
      },
    });
  }
}

export const accountService = new AccountService(socketService);
