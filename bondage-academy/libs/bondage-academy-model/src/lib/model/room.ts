import type { GameObject } from "./game-object";

export const ROOM_NAME_MAX_LENGHT = 60;
export const ROOM_DESCRIPTION_MAX_LENGHT = 100;

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

export interface RoomTemplateSettings {
  singleplayer?: boolean;
}

export interface Room {
  id: number;
  code?: string;
  name?: string;
  customName?: string;
  description?: string;
  template: boolean;
  templateSettings?: RoomTemplateSettings;
  persistent?: boolean;
  width: number;
  height: number;
  transitAreas: RoomTransitArea[];
  restrictions?: RoomRestrictions;
  objects: GameObject[];
}

export interface RoomSearchDetails {
  id: number;
  name?: string;
  customName?: string;
  description?: string;
  playersCount: number;
}
