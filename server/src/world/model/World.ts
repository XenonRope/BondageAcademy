import { type WorldObject } from "./WorldObject";

export interface World {
  roomId: number;
  width: number;
  height: number;
  objects: WorldObject[];
}
