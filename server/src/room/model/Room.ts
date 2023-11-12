import { type RoomObject } from "./objects/RoomObject";

export interface RoomTransitArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomRestrictions {
  singlePlayer?: boolean;
}

export interface Room {
  id: number;
  code?: string;
  name?: string;
  customName?: string;
  persistent: boolean;
  width: number;
  height: number;
  transitAreas: RoomTransitArea[];
  restrictions: RoomRestrictions;
  objects?: RoomObject[];
}
