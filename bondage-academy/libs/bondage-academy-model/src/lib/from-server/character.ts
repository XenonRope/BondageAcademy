import { CharacterPose } from "../model/character-pose";
import { Item } from "../model/item";
import { PartialRecord } from "../model/partial-record";
import { Player } from "../model/player";
import { Slot } from "../model/slot";

export interface SynchronizePlayersEvent {
  replacePlayers?: Player[];
  updatePlayers?: Array<{
    id: number;
    pose?: CharacterPose;
    items?: {
      add?: Item[];
      remove?: number[];
    };
    wearables?: PartialRecord<Slot, { item?: Item }>;
  }>;
}
