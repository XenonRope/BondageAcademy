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
}

const POSES_CONFIG: Record<AnyPose, PoseConfig> = {
  [FullBodyPose.PetSuit]: {
    iamgePathPart: "Pet suit",
    order: 50,
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
  },
  [LowerBodyPose.SimpleKneel]: {
    iamgePathPart: "Simple kneel",
    order: 50,
  },
  [LowerBodyPose.WideKneel]: {
    iamgePathPart: "Wide kneel",
    order: 55,
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
  yOffset?: number;
}

export class CharacterLayerService {
  getCharacterLayers(character: Character): CharacterLayer[] {
    const characterPrefix = "Kiri";
    const layers: CharacterLayer[] = [];
    if ("fullBody" in character.pose) {
      layers.push({
        url: `public/character/${characterPrefix} - ${characterLayerService.getImagePathPartForPose(
          character.pose.fullBody,
        )} - Body.png`,
        order: characterLayerService.getOrderForPose(character.pose.fullBody),
      });
    } else {
      layers.push({
        url: `public/character/${characterPrefix} - ${characterLayerService.getImagePathPartForPose(
          character.pose.upperBody,
        )} - Upper body.png`,
        order: characterLayerService.getOrderForPose(character.pose.upperBody),
      });
      layers.push({
        url: `public/character/${characterPrefix} - ${characterLayerService.getImagePathPartForPose(
          character.pose.lowerBody,
        )} - Lower body.png`,
        order: characterLayerService.getOrderForPose(character.pose.lowerBody),
      });
    }

    layers.sort((a, b) => a.order - b.order);

    return layers;
  }

  getImagePathPartForPose(pose: AnyPose): string {
    return POSES_CONFIG[pose].iamgePathPart;
  }

  getOrderForPose(pose: AnyPose): number {
    return POSES_CONFIG[pose].order;
  }
}

export const characterLayerService = new CharacterLayerService();
