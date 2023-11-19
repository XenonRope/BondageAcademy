import type { Position } from "./position";

export enum ObjectType {
  Player = "Player",
  Block = "Block",
}

export interface GameObject {
  type: ObjectType;
  id: number;
  position: Position;
}
