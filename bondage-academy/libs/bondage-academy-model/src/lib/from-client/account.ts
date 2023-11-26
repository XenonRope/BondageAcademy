import { Minigame } from "../model/minigame";
import type { Player } from "../model/player";
import { Room } from "../model/room";

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
  room?: Room;
  players: Player[];
  minigames: Minigame[];
}
