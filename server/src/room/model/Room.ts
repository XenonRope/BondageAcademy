import { type RoomObject } from "./objects/RoomObject";

export interface Room {
  id: number;
  code: string;
  name: string;
  width: number;
  height: number;
  objects?: RoomObject[];
}
