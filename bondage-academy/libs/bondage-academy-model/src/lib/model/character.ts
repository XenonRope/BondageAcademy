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

export interface Character {
  shape: CharacterShape;
  skin: CharacterSkin;
  wearables: PartialRecord<Slot, Item>;
  pose: CharacterPose;
}
