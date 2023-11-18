import type { GameObject } from "./GameObject";
import type { RoomRestrictions, RoomTransitArea } from "./Room";

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
