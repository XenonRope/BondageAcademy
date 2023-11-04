import { type WorldObject } from "./WorldObject";

export interface World {
  roomId: number;
  objects: WorldObject[];
}
