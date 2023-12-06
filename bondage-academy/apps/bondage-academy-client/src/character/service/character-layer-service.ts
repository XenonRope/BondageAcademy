import {
  AnyPose,
  Character,
  FullBodyPose,
  ItemConfig,
  ItemFragmentBodyType,
  LowerBodyPose,
  Slot,
  itemConfigs,
  poseConfigs,
} from "@bondage-academy/bondage-academy-model";

export interface CharacterLayer {
  url: string;
  order: number;
  offsetY?: number;
}

export class CharacterLayerService {
  getCharacterLayers(character: Character): CharacterLayer[] {
    const characterPrefix = "Kiri";
    const layers: CharacterLayer[] = [];
    const rootOffset = this.getRootOffset(
      character.pose.fullBody
        ? character.pose.fullBody
        : character.pose.lowerBody
    );
    if (character.pose.fullBody) {
      layers.push({
        url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.fullBody
        )} - Body.png`,
        order: this.getOrderForPose(character.pose.fullBody),
        offsetY: rootOffset,
      });
    } else if (character.pose.upperBody && character.pose.lowerBody) {
      layers.push({
        url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.upperBody
        )} - Upper body.png`,
        order: this.getOrderForPose(character.pose.upperBody),
        offsetY: rootOffset,
      });
      layers.push({
        url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.lowerBody
        )} - Lower body.png`,
        order: this.getOrderForPose(character.pose.lowerBody),
        offsetY: rootOffset,
      });
    }
    layers.push({
      url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
        character.pose.head
      )} - Head.png`,
      order: this.getOrderForPose(character.pose.head),
      offsetY: this.getOffset(character, rootOffset, ItemFragmentBodyType.Head),
    });

    layers.push(
      ...this.getWearableLayers(character, characterPrefix, rootOffset)
    );

    layers.sort((a, b) => a.order - b.order);

    return layers;
  }

  private getWearableLayers(
    character: Character,
    characterPrefix: string,
    rootOffset: number
  ): CharacterLayer[] {
    const layers: CharacterLayer[] = [];

    for (const [slot, equippedItem] of Object.entries(character.wearables)) {
      if (!equippedItem) {
        continue;
      }
      const itemConfig: ItemConfig = itemConfigs[equippedItem.item.code];

      for (const fragment of itemConfig.fragments) {
        if (fragment.slot !== (slot as Slot)) {
          continue;
        }

        let pose: AnyPose | undefined = undefined;
        if (fragment.bodyType === ItemFragmentBodyType.UpperBody) {
          pose = character.pose.fullBody ?? character.pose.upperBody;
        } else if (fragment.bodyType === ItemFragmentBodyType.LowerBody) {
          pose = character.pose.fullBody ?? character.pose.lowerBody;
        } else if (fragment.bodyType === ItemFragmentBodyType.Head) {
          pose = character.pose.head;
        }
        if (!pose) {
          continue;
        }
        if (
          character.pose.fullBody &&
          fragment.hiddenWhenFullBodyPose?.includes(character.pose.fullBody)
        ) {
          continue;
        }

        layers.push({
          url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
            pose
          )} - ${fragment.filePathSuffix}.png`,
          order: this.getOrderForPose(pose) + fragment.subOrder,
          offsetY: this.getOffset(character, rootOffset, fragment.bodyType),
        });
      }
    }

    return layers;
  }

  private getImagePathPartForPose(pose: AnyPose): string {
    return poseConfigs[pose].iamgePathPart;
  }

  private getOrderForPose(pose: AnyPose): number {
    return poseConfigs[pose].order;
  }

  private getOffset(
    character: Character,
    rootOffset: number,
    bodyType: ItemFragmentBodyType
  ): number {
    return (
      rootOffset +
      (character.pose.fullBody && bodyType === ItemFragmentBodyType.Head
        ? this.getHeadOffset(character.pose.fullBody)
        : 0)
    );
  }

  private getRootOffset(
    pose: FullBodyPose | LowerBodyPose | undefined
  ): number {
    if (!pose) {
      return 0;
    }
    return (poseConfigs[pose].rootOffsetY ?? 0) - 20;
  }

  private getHeadOffset(pose: FullBodyPose): number {
    return poseConfigs[pose].headOffsetY ?? 0;
  }
}
