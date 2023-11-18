import type { Player } from "../model/Player";
import type { World } from "../model/World";

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
  world: World;
}
