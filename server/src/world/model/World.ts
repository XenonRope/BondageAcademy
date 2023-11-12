import {
  type RoomRestrictions,
  type RoomTransitArea,
} from "../../room/model/Room";
import { type WorldObject } from "./WorldObject";

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
  objects: WorldObject[];
}
