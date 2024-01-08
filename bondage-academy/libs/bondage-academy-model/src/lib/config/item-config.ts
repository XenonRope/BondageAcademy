import { DictionaryKey } from "../i18n/dictionary";
import {
  AnyPose,
  FULL_BODY_POSES,
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "../model/character-pose";
import { ItemCode } from "../model/item";
import { PartialRecord } from "../model/partial-record";
import { Slot } from "../model/slot";
import { LayerOrder, LayerSubOrder } from "./layer-order";

export enum ItemFragmentBodyType {
  Head = "Head",
  UpperBody = "UpperBody",
  LowerBody = "LowerBody",
}

export interface ItemTexture {
  name: DictionaryKey;
  filePathSuffix: string;
}

export interface ItemFragment {
  name?: DictionaryKey;
  slot?: Slot;
  bodyType: ItemFragmentBodyType;
  poseMapping?: PartialRecord<AnyPose, AnyPose>;
  filePathSuffix: string;
  order?: LayerOrder;
  subOrder?: LayerSubOrder;
  shownForPoses?: AnyPose[];
  hiddenForPoses?: AnyPose[];
  textures?: ItemTexture[];
}

export interface RequiredPoses {
  fullBody?: FullBodyPose[];
  upperBody?: UpperBodyPose[];
  lowerBody?: LowerBodyPose[];
  head?: HeadPose[];
}

export interface ItemConfig {
  code: ItemCode;
  name: DictionaryKey;
  preview?: string;
  shoesOffset?: number;
  requiredPoses?: RequiredPoses;
  allowedSlots: Slot[];
  blockedSlots?: Slot[];
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
        hiddenForPoses: [FullBodyPose.PetSuit],
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
    requiredPoses: { head: [HeadPose.WideOpen] },
    allowedSlots: [Slot.Mouth],
    fragments: [
      {
        name: "fragments.ball",
        bodyType: ItemFragmentBodyType.Head,
        filePathSuffix: "Ball gag ball",
        subOrder: LayerSubOrder.Front,
      },
      {
        name: "fragments.strap",
        bodyType: ItemFragmentBodyType.Head,
        filePathSuffix: "Ball gag strap",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Nipples
  [ItemCode.NipplePiercingSphere]: {
    code: ItemCode.NipplePiercingSphere,
    name: "items.nipplePiercingSphere",
    allowedSlots: [Slot.Nipples],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        poseMapping: {
          [UpperBodyPose.Crossed]: UpperBodyPose.Attention,
          [UpperBodyPose.HandsUp]: UpperBodyPose.Attention,
        },
        filePathSuffix: "Nipple Piercing Sphere",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [FullBodyPose.PetSuit],
      },
    ],
  },
  [ItemCode.NipplePiercingSpider]: {
    code: ItemCode.NipplePiercingSpider,
    name: "items.nipplePiercingSpider",
    allowedSlots: [Slot.Nipples],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        poseMapping: {
          [UpperBodyPose.Crossed]: UpperBodyPose.Attention,
          [UpperBodyPose.HandsUp]: UpperBodyPose.Attention,
        },
        filePathSuffix: "Nipple Piercing Spider",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [FullBodyPose.PetSuit],
      },
    ],
  },
  [ItemCode.NipplePiercingCShape]: {
    code: ItemCode.NipplePiercingCShape,
    name: "items.nipplePiercingCShape",
    allowedSlots: [Slot.Nipples],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        poseMapping: {
          [UpperBodyPose.Crossed]: UpperBodyPose.Attention,
          [UpperBodyPose.HandsUp]: UpperBodyPose.Attention,
        },
        filePathSuffix: "Nipple Piercing C Shape",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [FullBodyPose.PetSuit],
      },
    ],
  },
  [ItemCode.NipplePiercingOrnament]: {
    code: ItemCode.NipplePiercingOrnament,
    name: "items.nipplePiercingOrnament",
    allowedSlots: [Slot.Nipples],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        poseMapping: {
          [UpperBodyPose.Crossed]: UpperBodyPose.Attention,
          [UpperBodyPose.HandsUp]: UpperBodyPose.Attention,
        },
        filePathSuffix: "Nipple Piercing Ornament",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [FullBodyPose.PetSuit],
      },
    ],
  },
  [ItemCode.NipplePiercingMoon]: {
    code: ItemCode.NipplePiercingMoon,
    name: "items.nipplePiercingMoon",
    allowedSlots: [Slot.Nipples],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        poseMapping: {
          [UpperBodyPose.Crossed]: UpperBodyPose.Attention,
          [UpperBodyPose.HandsUp]: UpperBodyPose.Attention,
        },
        filePathSuffix: "Nipple Piercing Moon",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [FullBodyPose.PetSuit],
      },
    ],
  },

  // Upper undies
  [ItemCode.BeccaMeshBra]: {
    code: ItemCode.BeccaMeshBra,
    name: "items.beccaMeshBra",
    preview: "Becca Mesh Bra Black",
    allowedSlots: [Slot.UpperUndies],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Becca Mesh Bra Black",
        subOrder: LayerSubOrder.Front,
        textures: [
          {
            name: "textures.dots",
            filePathSuffix: "Becca Mesh Bra Dots",
          },
        ],
      },
    ],
  },
  [ItemCode.BeyondSuitBra]: {
    code: ItemCode.BeyondSuitBra,
    name: "items.beyondSuitBra",
    allowedSlots: [Slot.UpperUndies],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Beyond Suit Bra",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Upper outfit
  [ItemCode.BeccaMeshTop]: {
    code: ItemCode.BeccaMeshTop,
    name: "items.beccaMeshTop",
    allowedSlots: [Slot.UpperOutfit],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Becca Mesh Top",
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
  [ItemCode.MagicChristmasGlove]: {
    code: ItemCode.MagicChristmasGlove,
    name: "items.magicChristmasGlove",
    preview: "Magic Christmas Glove",
    allowedSlots: [Slot.LeftSleeve, Slot.RightSleeve],
    fragments: [
      {
        slot: Slot.LeftSleeve,
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Magic Christmas Glove Left",
        subOrder: LayerSubOrder.Front,
      },
      {
        slot: Slot.RightSleeve,
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Magic Christmas Glove Right",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Body accessory
  [ItemCode.BeyondSuitBones]: {
    code: ItemCode.BeyondSuitBones,
    name: "items.beyondSuitBones",
    allowedSlots: [Slot.BodyAccessory],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Beyond Suit Bones Top",
        hiddenForPoses: FULL_BODY_POSES,
        subOrder: LayerSubOrder.Front,
      },
      {
        bodyType: ItemFragmentBodyType.LowerBody,
        poseMapping: {
          [LowerBodyPose.StandHeels]: LowerBodyPose.Stand,
          [LowerBodyPose.WideLegsHeels]: LowerBodyPose.WideLegs,
        },
        filePathSuffix: "Beyond Suit Bones Bottom",
        hiddenForPoses: FULL_BODY_POSES,
        subOrder: LayerSubOrder.Front,
      },
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Beyond Suit Bones",
        shownForPoses: FULL_BODY_POSES,
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Body
  [ItemCode.PetSuit]: {
    code: ItemCode.PetSuit,
    name: "items.petSuit",
    requiredPoses: {
      fullBody: [FullBodyPose.PetSuit],
      upperBody: [],
      lowerBody: [],
    },
    allowedSlots: [Slot.Body],
    blockedSlots: [Slot.Shoes],
    fragments: [
      {
        bodyType: ItemFragmentBodyType.UpperBody,
        filePathSuffix: "Pet suit",
        subOrder: LayerSubOrder.Front,
        shownForPoses: [FullBodyPose.PetSuit],
      },
    ],
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
        poseMapping: {
          [LowerBodyPose.StandHeels]: LowerBodyPose.Stand,
          [LowerBodyPose.WideLegsHeels]: LowerBodyPose.WideLegs,
        },
        filePathSuffix: "X Fashion Thong",
        subOrder: LayerSubOrder.Front,
      },
    ],
  },

  // Shoes
  [ItemCode.CynthiaHighHeels]: {
    code: ItemCode.CynthiaHighHeels,
    name: "items.cynthiaHighHeels",
    shoesOffset: -18,
    requiredPoses: {
      lowerBody: [
        LowerBodyPose.StandHeels,
        LowerBodyPose.WideLegsHeels,
        LowerBodyPose.SimpleKneel,
        LowerBodyPose.WideKneel,
      ],
    },
    allowedSlots: [Slot.Shoes],
    fragments: [
      {
        name: "fragments.strap",
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Strap",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [
          LowerBodyPose.SimpleKneel,
          LowerBodyPose.WideKneel,
          FullBodyPose.PetSuit,
        ],
      },
      {
        name: "fragments.insole",
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Insole",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [
          LowerBodyPose.SimpleKneel,
          LowerBodyPose.WideKneel,
          FullBodyPose.PetSuit,
        ],
      },
      {
        name: "fragments.platform",
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Platform",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [
          LowerBodyPose.SimpleKneel,
          LowerBodyPose.WideKneel,
          FullBodyPose.PetSuit,
        ],
      },
      {
        name: "fragments.outsole",
        bodyType: ItemFragmentBodyType.LowerBody,
        filePathSuffix: "Cynthia High Heels Outsole",
        subOrder: LayerSubOrder.Front,
        hiddenForPoses: [
          LowerBodyPose.SimpleKneel,
          LowerBodyPose.WideKneel,
          FullBodyPose.PetSuit,
        ],
      },
    ],
  },
};
