import { DictionaryKey } from "../i18n/dictionary";
import { AnyPose, FullBodyPose, HeadPose } from "../model/character-pose";
import { ItemCode } from "../model/item";
import { PartialRecord } from "../model/partial-record";
import { Slot } from "../model/slot";
import { LayerOrder, LayerSubOrder } from "./layer-order";

export enum ItemFragmentBodyType {
  Head = "Head",
  UpperBody = "UpperBody",
  LowerBody = "LowerBody",
}

export interface ItemFragment {
  slot?: Slot;
  bodyType: ItemFragmentBodyType;
  poseMapping?: PartialRecord<AnyPose, AnyPose>;
  filePathSuffix: string;
  order?: LayerOrder;
  subOrder?: LayerSubOrder;
  hiddenWhenFullBodyPose?: FullBodyPose[];
}

export interface ItemConfig {
  code: ItemCode;
  name: DictionaryKey;
  preview?: string;
  variants?: string[];
  allowedSlots: Slot[];
  fragments: ItemFragment[];
}

export const itemConfigs: Record<ItemCode, ItemConfig> = {
  // Hair
  [ItemCode.HalleyHair1]: {
    code: ItemCode.HalleyHair1,
    name: "items.hair1",
    allowedSlots: [Slot.Hair],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.Head,
        poseMapping: {
          [HeadPose.WideOpen]: HeadPose.Normal,
        },
        filePathSuffix: "Halley Hair 1 White Back",
        order: LayerOrder.HairBack,
        hiddenWhenFullBodyPose: [FullBodyPose.PetSuit],
      },
      {
        bodyType: ItemFragmentBodyType.Head,
        poseMapping: {
          [HeadPose.WideOpen]: HeadPose.Normal,
        },
        filePathSuffix: "Halley Hair 1 White Front",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Mouth
  [ItemCode.BallGag]: {
    code: ItemCode.BallGag,
    name: "items.ballGag",
    allowedSlots: [Slot.Mouth],
    fragments: [],
  },

  // Upper undies
  [ItemCode.BeccaMeshBra]: {
    code: ItemCode.BeccaMeshBra,
    name: "items.beccaMeshBra",
    preview: "Becca Mesh Bra",
    variants: ["Black", "Dots"],
    allowedSlots: [Slot.UpperUndies],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Becca Mesh Bra",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Sleeve
  [ItemCode.XFashionSleeve]: {
    code: ItemCode.XFashionSleeve,
    name: "items.xFashionSleeve",
    preview: "X Fashion Sleeve",
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

  // Body
  [ItemCode.PetSuit]: {
    code: ItemCode.PetSuit,
    name: "items.petSuit",
    allowedSlots: [Slot.Body],
    fragments: [],
  },

  // Lower undies
  [ItemCode.XFashionThong]: {
    code: ItemCode.XFashionThong,
    name: "items.xFashionThong",
    preview: "X Fashion Thong",
    allowedSlots: [Slot.LowerUndies],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "X Fashion Thong",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Shoes
  [ItemCode.CynthiaHighHeels]: {
    code: ItemCode.CynthiaHighHeels,
    name: "items.cynthiaHighHeels",
    allowedSlots: [Slot.Shoes],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Strap",
        subOrder: LayerSubOrder.Front,
      },
      {
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Insole",
        subOrder: LayerSubOrder.Front,
      },
      {
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Platform",
        subOrder: LayerSubOrder.Front,
      },
      {
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Outsole",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },
};
