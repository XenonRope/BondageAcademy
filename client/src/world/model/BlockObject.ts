import { WorldObjectType, type WorldObject } from "./WorldObject";

export enum BlockColor {
  Red = "Red",
  Green = "Green",
}

export interface BlockObject extends WorldObject {
  type: WorldObjectType.Block;
  color: BlockColor;
}

export const isBlockObject = (object?: WorldObject): object is BlockObject => {
  return object?.type === WorldObjectType.Block;
};
