import { CharacterPose } from "../model/character-pose";
import { Player } from "../model/player";

export interface SynchronizePlayersEvent {
  players: Player[];
}

export interface ChangePoseEvent {
  playerId: number;
  pose: CharacterPose;
}
