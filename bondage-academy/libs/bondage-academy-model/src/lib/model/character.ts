import { DictionaryKey } from "../i18n/dictionary";
import type { CharacterPose } from "./character-pose";
import type { Item } from "./item";
import type { PartialRecord } from "./partial-record";
import type { Slot } from "./slot";

export enum CharacterShape {
  Shape1 = "Shape_1",
}

export enum CharacterSkin {
  Skin1 = "Skin_1",
}

export interface ItemCustomization {
  fragmentName?: DictionaryKey;
  color?: string;
  texture?: string;
}

export interface EquippedItem {
  item: Item;
  ownerPlayerId: number;
  customizations?: ItemCustomization[];
}

export interface Character {
  shape: CharacterShape;
  skin: CharacterSkin;
  wearables: PartialRecord<Slot, EquippedItem>;
  pose: CharacterPose;
}
