import type { WorldObject } from "./WorldObject";

export interface World {
  objects: Record<number, WorldObject>;
}
