import type { WorldObject } from "./WorldObject";

export const WORLD_TILE_SIZE = 48;

export interface World {
  width: number;
  height: number;
  objects: Record<number, WorldObject | undefined>;
}
