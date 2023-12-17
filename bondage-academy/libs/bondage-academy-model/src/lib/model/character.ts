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

export interface ColortPartBrand {
  readonly ColorPart: unique symbol;
}

export const ColorPart = t.brand(
  t.Integer,
  (n): n is t.Branded<number, ColortPartBrand> => n >= 0 && n <= 255,
  "ColorPart"
);

export const ItemCustomization = t.type({
  fragmentName: t.union([t.string, t.undefined]),
  color: t.union([
    t.undefined,
    t.type({
      red: ColorPart,
      green: ColorPart,
      blue: ColorPart,
    }),
  ]),
  texture: t.union([t.string, t.undefined]),
});

export type ItemCustomization = t.TypeOf<typeof ItemCustomization>;

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
