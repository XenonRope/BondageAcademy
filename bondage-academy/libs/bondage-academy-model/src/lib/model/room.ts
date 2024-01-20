import type { GameObject } from "./game-object";
import { Minigame } from "./minigame";
import { Player } from "./player";

export const ROOM_NAME_MAX_LENGHT = 60;
export const ROOM_DESCRIPTION_MAX_LENGHT = 100;

export enum RoomCode {
  Introduction = "Introduction",
  PrisonCell = "PrisonCell",
  Garden = "Garden",
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

export enum RoomBackgroundElementImage {
  Grass = "Grass",
  Road = "Road",
}

export interface RoomBackgroundElement {
  x: number;
  y: number;
  width: number;
  height: number;
  image: RoomBackgroundElementImage;
}

export interface Room {
  id: number;
  code?: string;
  name?: string;
  customName?: string;
  description?: string;
  template: boolean;
  templateSettings?: RoomTemplateSettings;
  templateRoomId?: number;
  templateRoomCode?: string;
  persistent?: boolean;
  width: number;
  height: number;
  transitAreas: RoomTransitArea[];
  restrictions?: RoomRestrictions;
  backgroundElements: RoomBackgroundElement[];
  objects: GameObject[];
}

export interface RoomSearchDetails {
  id: number;
  name?: string;
  customName?: string;
  description?: string;
  playersCount: number;
}

export interface RoomState {
  room: Room;
  players: Player[];
  minigames: Minigame[];
}
