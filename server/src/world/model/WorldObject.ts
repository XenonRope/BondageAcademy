import { type Position } from "../../common/model/Position";

export enum WorldObjectType {
  Player = "Player",
}

export interface WorldObject {
  type: WorldObjectType;
  id: number;
  position: Position;
}

export interface WorldObjectForClient {
  type: WorldObjectType;
  id: number;
  position: Position;
}
