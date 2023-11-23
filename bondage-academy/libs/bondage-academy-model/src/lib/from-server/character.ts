import { CharacterPose } from "../model/character-pose";
import { Item, ItemCode } from "../model/item";
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
      remove?: ItemCode[];
    };
    wearables?: PartialRecord<Slot, { item?: Item }>;
  }>;
}
