import type { Position } from "./position";

export enum ObjectType {
  Player = "Player",
  Block = "Block",
  NPC = "NPC",
}

export interface GameObject {
  type: ObjectType;
  id: number;
  position: Position;
}
