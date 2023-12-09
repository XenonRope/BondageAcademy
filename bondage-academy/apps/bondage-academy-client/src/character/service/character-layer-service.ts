import {
  AnyPose,
  Character,
  ItemConfig,
  ItemFragment,
  ItemFragmentBodyType,
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
    const rootOffset = this.getRootOffset(character);
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
      offsetY: rootOffset + this.getHeadOffset(character),
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
        if ((fragment.slot ?? itemConfig.allowedSlots[0]) !== (slot as Slot)) {
          continue;
        }

        const pose = this.getPoseForFragment(fragment, character);
        if (!pose) {
          continue;
        }
        if (
          character.pose.fullBody &&
          fragment.hiddenWhenFullBodyPose?.includes(character.pose.fullBody)
        ) {
          continue;
        }

        const variant = equippedItem.item.variant
          ? ` ${equippedItem.item.variant}`
          : "";

        layers.push({
          url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
            pose
          )} - ${fragment.filePathSuffix}${variant}.png`,
          order:
            (fragment.order ?? this.getOrderForPose(pose)) +
            (fragment.subOrder ?? 0),
          offsetY:
            rootOffset +
            (fragment.bodyType === ItemFragmentBodyType.Head
              ? this.getHeadOffset(character)
              : 0),
        });
      }
    }

    return layers;
  }

  private getPoseForFragment(
    fragment: ItemFragment,
    character: Character
  ): AnyPose | undefined {
    if (fragment.pose) {
      return fragment.pose;
    }

    if (fragment.bodyType === ItemFragmentBodyType.UpperBody) {
      return character.pose.fullBody ?? character.pose.upperBody;
    } else if (fragment.bodyType === ItemFragmentBodyType.LowerBody) {
      return character.pose.fullBody ?? character.pose.lowerBody;
    } else if (fragment.bodyType === ItemFragmentBodyType.Head) {
      return character.pose.head;
    }
    return undefined;
  }

  private getImagePathPartForPose(pose: AnyPose): string {
    return poseConfigs[pose].iamgePathPart;
  }

  private getOrderForPose(pose: AnyPose): number {
    return poseConfigs[pose].order;
  }

  private getRootOffset(character: Character): number {
    const pose = character.pose.fullBody ?? character.pose.lowerBody;
    if (!pose) {
      return 0;
    }
    return (poseConfigs[pose].rootOffsetY ?? 0) - 20;
  }

  private getHeadOffset(character: Character): number {
    const pose = character.pose.fullBody;
    return (pose && poseConfigs[pose].headOffsetY) ?? 0;
  }
}
