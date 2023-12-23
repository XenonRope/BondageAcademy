import {
  AnyPose,
  Character,
  CharacterPose,
  Color,
  ItemConfig,
  ItemFragment,
  ItemFragmentBodyType,
  Slot,
  isFullBodyCharacterPose,
  itemConfigs,
  poseConfigs,
  slotConfigs,
} from "@bondage-academy/bondage-academy-model";

export interface CharacterLayer {
  url: string;
  order: number;
  offsetY?: number;
  color?: Color;
  slot?: Slot;
  fragmentName?: string;
}

export class CharacterLayerService {
  getCharacterLayers(character: Character): CharacterLayer[] {
    const characterPrefix = "Kiri";
    const layers: CharacterLayer[] = [];
    const rootOffset = this.getRootOffset(character);
    if (isFullBodyCharacterPose(character.pose)) {
      layers.push({
        url: `character/${characterPrefix} - ${this.getImagePathPartForPose(
          character.pose.fullBody
        )} - Body.png`,
        order: this.getOrderForPose(character.pose.fullBody),
        offsetY: rootOffset,
      });
    } else {
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

    for (const slot of Object.keys(slotConfigs)) {
      const equippedItem = character.wearables[slot as Slot];
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
        if (!this.shouldShowFragmentForPose(fragment, character.pose)) {
          continue;
        }

        const customization = equippedItem.customizations?.find(
          (customization) => customization.fragmentName === fragment.name
        );
        const filePathSuffix =
          (customization?.texture &&
            fragment.textures?.find(
              (texture) => texture.name === customization.texture
            )?.filePathSuffix) ??
          fragment.filePathSuffix;

        layers.push({
          url: `character/${characterPrefix} - ${this.getImagePathPartForFragmentPose(
            fragment,
            character
          )} - ${filePathSuffix}.png`,
          order:
            (fragment.order ?? this.getOrderForPose(pose)) +
            (fragment.subOrder ?? 0),
          offsetY:
            rootOffset +
            (fragment.bodyType === ItemFragmentBodyType.Head
              ? this.getHeadOffset(character)
              : 0),
          color: customization?.color,
          slot: slot as Slot,
          fragmentName: fragment.name,
        });
      }
    }

    return layers;
  }

  private shouldShowFragmentForPose(
    fragment: ItemFragment,
    characterPose: CharacterPose
  ): boolean {
    if (!fragment.hiddenForPoses) {
      return true;
    }

    if (isFullBodyCharacterPose(characterPose)) {
      if (fragment.hiddenForPoses.includes(characterPose.fullBody)) {
        return false;
      }
    } else {
      if (
        fragment.hiddenForPoses.includes(characterPose.upperBody) ||
        fragment.hiddenForPoses.includes(characterPose.lowerBody)
      ) {
        return false;
      }
    }

    return !fragment.hiddenForPoses.includes(characterPose.head);
  }

  private getPoseForFragment(
    fragment: ItemFragment,
    character: Character
  ): AnyPose {
    switch (fragment.bodyType) {
      case ItemFragmentBodyType.UpperBody:
        return isFullBodyCharacterPose(character.pose)
          ? character.pose.fullBody
          : character.pose.upperBody;
      case ItemFragmentBodyType.LowerBody:
        return isFullBodyCharacterPose(character.pose)
          ? character.pose.fullBody
          : character.pose.lowerBody;
      case ItemFragmentBodyType.Head:
        return character.pose.head;
    }
  }

  private getImagePathPartForFragmentPose(
    fragment: ItemFragment,
    character: Character
  ): string {
    let pose = this.getPoseForFragment(fragment, character);
    if (!pose) {
      return "";
    }
    pose = fragment.poseMapping?.[pose] ?? pose;
    return this.getImagePathPartForPose(pose);
  }

  private getImagePathPartForPose(pose: AnyPose): string {
    return poseConfigs[pose].iamgePathPart;
  }

  private getOrderForPose(pose: AnyPose): number {
    return poseConfigs[pose].order;
  }

  private getRootOffset(character: Character): number {
    const pose = isFullBodyCharacterPose(character.pose)
      ? character.pose.fullBody
      : character.pose.lowerBody;
    const wearablesOffset: number = Object.values(character.wearables)
      .map(
        (equippedItem) =>
          (equippedItem && itemConfigs[equippedItem.item.code].offset) ?? 0
      )
      .reduce((a, b) => a + b, 0);
    return (poseConfigs[pose].rootOffsetY ?? 0) + wearablesOffset - 20;
  }

  private getHeadOffset(character: Character): number {
    return isFullBodyCharacterPose(character.pose)
      ? poseConfigs[character.pose.fullBody].headOffsetY ?? 0
      : 0;
  }
}
