import {
  AnyPose,
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "../model/character-pose";
import { LayerOrder } from "./layer-order";

export interface PoseConfig {
  iamgePathPart: string;
  order: number;
  rootOffsetY?: number;
  headOffsetY?: number;
}

export const poseConfigs: Record<AnyPose, PoseConfig> = {
  [FullBodyPose.PetSuit]: {
    iamgePathPart: "Pet suit",
    order: LayerOrder.LowerBody,
    rootOffsetY: 288,
    headOffsetY: 214,
  },
  [UpperBodyPose.Attention]: {
    iamgePathPart: "Attention",
    order: LayerOrder.UpperBody,
  },
  [UpperBodyPose.Crossed]: {
    iamgePathPart: "Crossed",
    order: LayerOrder.UpperBodyFront,
  },
  [LowerBodyPose.Stand]: {
    iamgePathPart: "Stand",
    order: LayerOrder.LowerBody,
    rootOffsetY: 39,
  },
  [LowerBodyPose.SimpleKneel]: {
    iamgePathPart: "Simple kneel",
    order: LayerOrder.LowerBodyFront,
    rootOffsetY: 280,
  },
  [LowerBodyPose.WideKneel]: {
    iamgePathPart: "Wide kneel",
    order: LayerOrder.LowerBodyFront,
    rootOffsetY: 280,
  },
  [HeadPose.Normal]: {
    iamgePathPart: "Normal",
    order: LayerOrder.Head,
  },
  [HeadPose.WideOpen]: {
    iamgePathPart: "Wide open",
    order: LayerOrder.Head,
  },
};
