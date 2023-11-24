import { DictionaryKey } from "../i18n/dictionary";
import { ItemCode } from "../model/item";
import { Slot } from "../model/slot";

export enum ItemFragmentBodyType {
  Head = "Head",
  UpperBody = "UpperBody",
  LowerBody = "LowerBody",
}

export interface ItemFragment {
  slot: Slot;
  bodyType: ItemFragmentBodyType;
  filePathSuffix: string;
  order: number;
}

export interface ItemConfig {
  code: ItemCode;
  name: DictionaryKey;
  allowedSlots: Slot[];
  fragments: ItemFragment[];
}

export const itemConfigs: Record<ItemCode, ItemConfig> = {
  [ItemCode.XFashionSleeve]: {
    code: ItemCode.XFashionSleeve,
    name: "items.xFashionSleeve",
    allowedSlots: [Slot.LeftSleeve, Slot.RightSleeve],
    fragments: [
      {
        slot: Slot.LeftSleeve,
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "X Fashion Sleeve Left",
        order: 200,
      },
      {
        slot: Slot.RightSleeve,
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "X Fashion Sleeve Right",
        order: 200,
      },
    ],
  },
  [ItemCode.XFashionThong]: {
    code: ItemCode.XFashionThong,
    name: "items.xFashionThong",
    allowedSlots: [],
    fragments: [],
  },
  [ItemCode.BallGag]: {
    code: ItemCode.BallGag,
    name: "items.ballGag",
    allowedSlots: [Slot.Mouth],
    fragments: [],
  },
  [ItemCode.PetSuit]: {
    code: ItemCode.PetSuit,
    name: "items.petSuit",
    allowedSlots: [Slot.Body],
    fragments: [],
  },
};
