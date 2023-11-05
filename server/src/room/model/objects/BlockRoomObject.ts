import { RoomObjectType, type RoomObject } from "./RoomObject";

export enum BlockColor {
  Red = "Red",
  Green = "Green",
}

export interface BlockRoomObject extends RoomObject {
  type: RoomObjectType.Block;
  color: BlockColor;
}

export const isBlockRoomObject = (
  object: RoomObject
): object is BlockRoomObject => {
  return object.type === RoomObjectType.Block;
};
