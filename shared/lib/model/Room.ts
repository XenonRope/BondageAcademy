import type { GameObject } from "./GameObject";

export enum RoomCode {
  Introduction = "Introduction",
  PrisonCell = "PrisonCell",
}

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
  objects?: GameObject[];
}
