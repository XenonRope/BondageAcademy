import { RequiredPoses, itemConfigs } from "../config/item-config";
import { Character } from "../model/character";
import {
  CharacterPose,
  isStandardCharacterPose,
} from "../model/character-pose";

export class CharacterPoseValidator {
  isPoseValid(character: Character, pose: CharacterPose): boolean {
    const requiredPoses = this.getRequiredPoses(character);

    if (requiredPoses.head && !requiredPoses.head.includes(pose.head)) {
      return false;
    }

    if (isStandardCharacterPose(pose)) {
      if (
        requiredPoses.upperBody &&
        !requiredPoses.upperBody.includes(pose.upperBody)
      ) {
        return false;
      }
      if (
        requiredPoses.lowerBody &&
        !requiredPoses.lowerBody.includes(pose.lowerBody)
      ) {
        return false;
      }
    } else if (
      requiredPoses.fullBody &&
      !requiredPoses.fullBody.includes(pose.fullBody)
    ) {
      return false;
    }

    return true;
  }

  isAnyValidPose(character: Character): boolean {
    const requiredPoses = this.getRequiredPoses(character);
    return (
      (requiredPoses.fullBody?.length !== 0 ||
        (requiredPoses.upperBody?.length !== 0 &&
          requiredPoses.lowerBody?.length !== 0)) &&
      requiredPoses.head?.length !== 0
    );
  }

  getRequiredPoses(character: Character): RequiredPoses {
    return Object.values(character.wearables)
      .filter((equippedItem) => equippedItem)
      .map((equippedItem) => itemConfigs[equippedItem.item.code].requiredPoses)
      .flatMap((requiredPoses) => (requiredPoses ? [requiredPoses] : []))
      .reduce((first, second) => this.mergeRequiredPoses(first, second), {
        fullBody: undefined,
        upperBody: undefined,
        lowerBody: undefined,
        head: undefined,
      });
  }

  private mergeRequiredPoses(
    first: RequiredPoses,
    second: RequiredPoses,
  ): RequiredPoses {
    return {
      fullBody: this.intersection(first.fullBody, second.fullBody),
      upperBody: this.intersection(first.upperBody, second.upperBody),
      lowerBody: this.intersection(first.lowerBody, second.lowerBody),
      head: this.intersection(first.head, second.head),
    };
  }

  private intersection<T>(
    firstArray: T[] | undefined,
    secondArray: T[] | undefined,
  ): T[] | undefined {
    if (firstArray !== undefined && secondArray !== undefined) {
      return firstArray.filter((value) => secondArray.includes(value));
    }
    return firstArray || secondArray;
  }
}
