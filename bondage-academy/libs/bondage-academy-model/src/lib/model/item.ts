import { DictionaryKey } from "../i18n/dictionary";
import { Slot } from "./slot";

export enum ItemCode {
  XFashionSleeve = "XFashionSleeve",
  XFashionThong = "XFashionThong",
  BallGag = "BallGag",
  PetSuit = "PetSuit",
}
export interface Item {
  code: ItemCode;
}

export interface ItemConfig {
  code: ItemCode;
  name: DictionaryKey;
  allowedSlots: Slot[];
}

export const itemConfigs: Record<ItemCode, ItemConfig> = {
  [ItemCode.XFashionSleeve]: {
    code: ItemCode.XFashionSleeve,
    name: "items.xFashionSleeve",
    allowedSlots: [Slot.LeftSleeve, Slot.RightSleeve],
  },
  [ItemCode.XFashionThong]: {
    code: ItemCode.XFashionThong,
    name: "items.xFashionThong",
    allowedSlots: [],
  },
  [ItemCode.BallGag]: {
    code: ItemCode.BallGag,
    name: "items.ballGag",
    allowedSlots: [Slot.Mouth],
  },
  [ItemCode.PetSuit]: {
    code: ItemCode.PetSuit,
    name: "items.petSuit",
    allowedSlots: [Slot.Body],
  },
};
