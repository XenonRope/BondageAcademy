import type { GameObject } from "./game-object";

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
  players?: number[];
}

export interface Room {
  id: number;
  code?: string;
  name?: string;
  customName?: string;
  template: boolean;
  persistent?: boolean;
  width: number;
  height: number;
  transitAreas: RoomTransitArea[];
  restrictions?: RoomRestrictions;
  objects: GameObject[];
}
