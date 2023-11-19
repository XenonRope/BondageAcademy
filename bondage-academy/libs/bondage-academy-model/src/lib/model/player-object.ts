import { ObjectType, type GameObject } from "./game-object";

export interface PlayerObject extends GameObject {
  type: ObjectType.Player;
  playerId: number;
}

export const isPlayerObject = (object?: GameObject): object is PlayerObject =>
  object != null && object.type === ObjectType.Player;
