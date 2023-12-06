import { DictionaryKey } from "../i18n/dictionary";
import { AnyPose, FullBodyPose, HeadPose } from "../model/character-pose";
import { ItemCode } from "../model/item";
import { Slot } from "../model/slot";
import { LayerOrder, LayerSubOrder } from "./layer-order";

export enum ItemFragmentBodyType {
  Head = "Head",
  UpperBody = "UpperBody",
  LowerBody = "LowerBody",
}

export interface ItemFragment {
  slot: Slot;
  bodyType: ItemFragmentBodyType;
  pose?: AnyPose;
  filePathSuffix: string;
  order?: LayerOrder;
  subOrder?: LayerSubOrder;
  hiddenWhenFullBodyPose?: FullBodyPose[];
}

export interface ItemConfig {
  code: ItemCode;
  name: DictionaryKey;
  allowedSlots: Slot[];
  fragments: ItemFragment[];
}

export const itemConfigs: Record<ItemCode, ItemConfig> = {
  [ItemCode.HalleyHair1]: {
    code: ItemCode.HalleyHair1,
    name: "items.hair1",
    allowedSlots: [Slot.Hair],
    fragments: [
      {
        slot: Slot.Hair,
        bodyType: ItemFragmentBodyType.Head,
        pose: HeadPose.Normal,
        filePathSuffix: "Halley Hair 1 White Back",
        order: LayerOrder.HairBack,
        hiddenWhenFullBodyPose: [FullBodyPose.PetSuit],
      },
      {
        slot: Slot.Hair,
        bodyType: ItemFragmentBodyType.Head,
        pose: HeadPose.Normal,
        filePathSuffix: "Halley Hair 1 White Front",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },
  [ItemCode.XFashionSleeve]: {
    code: ItemCode.XFashionSleeve,
    name: "items.xFashionSleeve",
    allowedSlots: [Slot.LeftSleeve, Slot.RightSleeve],
    fragments: [
      {
        slot: Slot.LeftSleeve,
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "X Fashion Sleeve Left",
        subOrder: LayerSubOrder.Front,
      },
      {
        slot: Slot.RightSleeve,
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "X Fashion Sleeve Right",
        subOrder: LayerSubOrder.Front,
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
