import type { CharacterPose } from "./CharacterPose";
import { type Slot } from "./Slot";
import { type Wearable } from "./Wearable";

export enum CharacterShape {
  Shape1 = "Shape_1",
}

export enum CharacterSkin {
  Skin1 = "Skin_1",
}

export interface Character {
  shape: CharacterShape;
  skin: CharacterSkin;
  wearables: Map<Slot, Wearable>;
  pose: CharacterPose;
}
