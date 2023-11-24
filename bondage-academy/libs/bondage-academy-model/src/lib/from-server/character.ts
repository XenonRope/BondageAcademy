import { EquippedItem } from "../model/character";
import { CharacterPose } from "../model/character-pose";
import { Item } from "../model/item";
import { Player } from "../model/player";
import { Slot } from "../model/slot";

export interface SynchronizePlayersEvent {
  replacePlayers?: Player[];
  updatePlayers?: UpdatePlayer[];
}

export interface UpdatePlayer {
  id: number;
  pose?: CharacterPose;
  items?: {
    add?: Item[];
    remove?: number[];
  };
  wearables?: Array<{ slot: Slot; equippedItem?: EquippedItem }>;
}
