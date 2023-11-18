import type { GameObject, ObjectType } from "./GameObject";

export enum BlockColor {
  Red = "Red",
  Green = "Green",
}

export interface BlockObject extends GameObject {
  type: ObjectType.Block;
  color: BlockColor;
}
