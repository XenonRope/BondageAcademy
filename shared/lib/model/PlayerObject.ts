import { ObjectType, type GameObject } from "./GameObject";

export interface PlayerObject extends GameObject {
  type: ObjectType.Player;
  playerId: number;
}

export const isPlayerObject = (object: GameObject): object is PlayerObject =>
  object.type === ObjectType.Player;
