import type { Character } from "../../character/model/Character";
import type { Item } from "../../item/model/Item";

export interface Player {
  id: number;
  name: string;
  character: Character;
  items: Item[];
}
