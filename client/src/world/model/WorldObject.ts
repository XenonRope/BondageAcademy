import type { Position } from "../../common/model/Position";

export enum WorldObjectType {
  Player = "Player",
  Block = "Block",
}

export interface WorldObject {
  type: WorldObjectType;
  id: number;
  position: Position;
}
