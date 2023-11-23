import { Item } from "../model/item";

export interface AddItemEvent {
  playerId: number;
  items: Item[];
}
