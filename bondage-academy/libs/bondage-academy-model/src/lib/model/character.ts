import * as t from "io-ts";
import type { CharacterPose } from "./character-pose";
import { Color } from "./color";
import type { Item, PhantomItem } from "./item";
import type { PartialRecord } from "./partial-record";
import type { Slot } from "./slot";

export enum CharacterShape {
  Shape1 = "Shape_1",
}

export enum CharacterSkin {
  Skin1 = "Skin_1",
}

export const ItemCustomization = t.type({
  fragmentName: t.union([t.string, t.undefined]),
  color: t.union([t.undefined, Color]),
  texture: t.union([t.string, t.undefined]),
});

export type ItemCustomization = t.TypeOf<typeof ItemCustomization>;

export interface EquippedItem {
  item: Item | PhantomItem;
  ownerPlayerId: number;
  customizations?: ItemCustomization[];
}

export interface Character {
  shape: CharacterShape;
  skin: CharacterSkin;
  wearables: PartialRecord<Slot, EquippedItem>;
  pose: CharacterPose;
}
