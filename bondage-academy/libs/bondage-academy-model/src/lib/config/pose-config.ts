import { DictionaryKey } from "../i18n/dictionary";
import {
  AnyPose,
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "../model/character-pose";
import { LayerOrder } from "./layer-order";

export interface PoseConfig {
  name: DictionaryKey;
  iamgePathPart: string;
  order: number;
  rootOffsetY?: number;
  headOffsetY?: number;
}

export const poseConfigs: Record<AnyPose, PoseConfig> = {
  [FullBodyPose.PetSuit]: {
    name: "poses.petSuit",
    iamgePathPart: "Pet suit",
    order: LayerOrder.LowerBody,
    rootOffsetY: 288,
    headOffsetY: 214,
  },
  [UpperBodyPose.Attention]: {
    name: "poses.attention",
    iamgePathPart: "Attention",
    order: LayerOrder.UpperBody,
  },
  [UpperBodyPose.Crossed]: {
    name: "poses.crossed",
    iamgePathPart: "Crossed",
    order: LayerOrder.UpperBodyFront,
  },
  [UpperBodyPose.HandsUp]: {
    name: "poses.handsUp",
    iamgePathPart: "Hands up",
    order: LayerOrder.UpperBody,
  },
  [LowerBodyPose.Stand]: {
    name: "poses.stand",
    iamgePathPart: "Stand",
    order: LayerOrder.LowerBody,
    rootOffsetY: 39,
  },
  [LowerBodyPose.StandHeels]: {
    name: "poses.standHeels",
    iamgePathPart: "Stand heels",
    order: LayerOrder.LowerBody,
    rootOffsetY: 20,
  },
  [LowerBodyPose.WideLegs]: {
    name: "poses.wideLegs",
    iamgePathPart: "Wide legs",
    order: LayerOrder.LowerBody,
    rootOffsetY: 45,
  },
  [LowerBodyPose.WideLegsHeels]: {
    name: "poses.wideLegsHeels",
    iamgePathPart: "Wide legs heels",
    order: LayerOrder.LowerBody,
    rootOffsetY: 30,
  },
  [LowerBodyPose.SimpleKneel]: {
    name: "poses.simpleKneel",
    iamgePathPart: "Simple kneel",
    order: LayerOrder.LowerBodyFront,
    rootOffsetY: 280,
  },
  [LowerBodyPose.WideKneel]: {
    name: "poses.wideKneel",
    iamgePathPart: "Wide kneel",
    order: LayerOrder.LowerBodyFront,
    rootOffsetY: 280,
  },
  [HeadPose.Normal]: {
    name: "poses.normal",
    iamgePathPart: "Normal",
    order: LayerOrder.Head,
  },
  [HeadPose.WideOpen]: {
    name: "poses.wideOpen",
    iamgePathPart: "Wide open",
    order: LayerOrder.Head,
  },
};
