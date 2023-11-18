import type { Character } from "./Character";
import type { Item } from "./Item";

export interface Player {
  id: number;
  name: string;
  roomId?: number;
  worldId?: number;
  character: Character;
  items: Item[];
}
