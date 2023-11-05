import { type RoomObject } from "./objects/RoomObject";

export interface Room {
  id: number;
  code: string;
  name: string;
  objects?: RoomObject[];
}
