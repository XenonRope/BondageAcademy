import * as t from "io-ts";
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

export const ItemCustomizationSchema = t.type({
  fragmentName: t.union([t.string, t.undefined]),
  color: t.union([
    t.undefined,
    t.type({
      red: t.number,
      green: t.number,
      blue: t.number,
    }),
  ]),
  texture: t.union([t.string, t.undefined]),
});

export type ItemCustomization = t.TypeOf<typeof ItemCustomizationSchema>;

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
