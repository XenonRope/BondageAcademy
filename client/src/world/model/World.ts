import type { WorldObject } from "./WorldObject";

export interface World {
  width: number;
  height: number;
  objects: Record<number, WorldObject>;
}
