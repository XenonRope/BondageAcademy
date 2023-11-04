import type { Position } from "../../common/model/Position";

export enum WorldObjectType {
  Player = "Player",
}

export interface WorldObject {
  type: WorldObjectType.Player;
  id: number;
  position: Position;
}
