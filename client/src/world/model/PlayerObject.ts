import type { Character } from "../../character/model/Character";
import type { Position } from "../../common/model/Position";
import { WorldObjectType, type WorldObject } from "./WorldObject";

export interface PlayerObject extends WorldObject {
  type: WorldObjectType.Player;
  playerId: number;
  name: string;
  character: Character;
  motion?: {
    startPosition: Position;
    currentPosition: Position;
    endPosition: Position;
    startTime: Date;
    endTime: Date;
  };
}

export const isPlayerObject = (
  object?: WorldObject,
): object is PlayerObject => {
  return object?.type === WorldObjectType.Player;
};
