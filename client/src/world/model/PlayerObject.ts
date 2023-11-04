import { WorldObjectType, type WorldObject } from "./WorldObject";

export interface PlayerObject extends WorldObject {
  type: WorldObjectType.Player;
  playerId: number;
  name: string;
}

export const isPlayerObject = (object: WorldObject): object is PlayerObject => {
  return object.type === WorldObjectType.Player;
};
