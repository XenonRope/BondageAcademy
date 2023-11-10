import type { Character } from "../model/Character";
import {
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
  type AnyPose,
} from "../model/CharacterPose";

interface PoseConfig {
  iamgePathPart: string;
  order: number;
  rootOffsetY?: number;
  headOffsetY?: number;
}

const POSES_CONFIG: Record<AnyPose, PoseConfig> = {
  [FullBodyPose.PetSuit]: {
    iamgePathPart: "Pet suit",
    order: 50,
    rootOffsetY: 288,
    headOffsetY: 214,
  },
  [UpperBodyPose.Attention]: {
    iamgePathPart: "Attention",
    order: 52,
  },
  [UpperBodyPose.Crossed]: {
    iamgePathPart: "Crossed",
    order: 57,
  },
  [LowerBodyPose.Stand]: {
    iamgePathPart: "Stand",
    order: 50,
    rootOffsetY: 39,
  },
  [LowerBodyPose.SimpleKneel]: {
    iamgePathPart: "Simple kneel",
    order: 50,
    rootOffsetY: 280,
  },
  [LowerBodyPose.WideKneel]: {
    iamgePathPart: "Wide kneel",
    order: 55,
    rootOffsetY: 280,
  },
  [HeadPose.Normal]: {
    iamgePathPart: "Normal",
    order: 100,
  },
  [HeadPose.WideOpen]: {
    iamgePathPart: "Wide open",
    order: 100,
  },
};

export interface CharacterLayer {
  url: string;
  order: number;
  offsetY?: number;
}

export class CharacterLayerService {
  getCharacterLayers(character: Character): CharacterLayer[] {
    const characterPrefix = "Kiri";
    const layers: CharacterLayer[] = [];
    const rootOffsetY = this.getRootOffset(
      "fullBody" in character.pose
        ? character.pose.fullBody
        : character.pose.lowerBody,
    );
    if ("fullBody" in character.pose) {
      layers.push({
        url: `public/character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.fullBody,
        )} - Body.png`,
        order: this.getOrderForPose(character.pose.fullBody),
        offsetY: rootOffsetY,
      });
    } else {
      layers.push({
        url: `public/character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.upperBody,
        )} - Upper body.png`,
        order: this.getOrderForPose(character.pose.upperBody),
        offsetY: rootOffsetY,
      });
      layers.push({
        url: `public/character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.lowerBody,
        )} - Lower body.png`,
        order: this.getOrderForPose(character.pose.lowerBody),
        offsetY: rootOffsetY,
      });
    }
    layers.push({
      url: `public/character/${characterPrefix} - ${this.getImagePathPartForPose(
        character.pose.head,
      )} - Head.png`,
      order: this.getOrderForPose(character.pose.head),
      offsetY:
        rootOffsetY +
        ("fullBody" in character.pose
          ? this.getHeadOffsetY(character.pose.fullBody)
          : 0),
    });

    layers.sort((a, b) => a.order - b.order);

    return layers;
  }

  getImagePathPartForPose(pose: AnyPose): string {
    return POSES_CONFIG[pose].iamgePathPart;
  }

  getOrderForPose(pose: AnyPose): number {
    return POSES_CONFIG[pose].order;
  }

  getRootOffset(pose: FullBodyPose | LowerBodyPose): number {
    return (POSES_CONFIG[pose].rootOffsetY ?? 0) - 20;
  }

  getHeadOffsetY(pose: FullBodyPose): number {
    return POSES_CONFIG[pose].headOffsetY ?? 0;
  }
}

export const characterLayerService = new CharacterLayerService();
