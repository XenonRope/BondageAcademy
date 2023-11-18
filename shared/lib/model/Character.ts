import type { CharacterPose } from "./CharacterPose";
import type { Item } from "./Item";
import type { PartialRecord } from "./PartialRecord";
import type { Slot } from "./Slot";

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
