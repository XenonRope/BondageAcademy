import type { Character } from "./character";
import type { Item } from "./item";

export interface Player {
  id: number;
  name: string;
  roomId?: number;
  character: Character;
  items: Item[];
}
