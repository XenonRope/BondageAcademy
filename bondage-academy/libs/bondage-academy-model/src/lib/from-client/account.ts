import type { Player } from "../model/player";
import type { World } from "../model/world";

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
  playerId: number;
  world: World;
  players: Player[];
}
