import { GameObject, ObjectType } from "./game-object";

export enum BlockColor {
  Red = "Red",
  Green = "Green",
}

export interface BlockObject extends GameObject {
  type: ObjectType.Block;
  color: BlockColor;
}

export const isBlockObject = (object?: GameObject): object is BlockObject =>
  object != null && object.type === ObjectType.Block;
