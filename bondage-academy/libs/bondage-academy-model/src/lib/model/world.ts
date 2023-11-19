import type { GameObject } from "./game-object";
import type { RoomRestrictions, RoomTransitArea } from "./room";

export interface World {
  id: number;
  roomId: number;
  name?: string;
  customName?: string;
  persistent: boolean;
  width: number;
  height: number;
  transitAreas: RoomTransitArea[];
  restrictions: RoomRestrictions;
  objects: GameObject[];
}
