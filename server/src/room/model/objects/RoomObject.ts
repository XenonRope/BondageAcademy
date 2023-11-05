import { type Position } from "../../../common/model/Position";

export enum RoomObjectType {
  Block = "Block",
}

export interface RoomObject {
  type: RoomObjectType;
  position: Position;
}
