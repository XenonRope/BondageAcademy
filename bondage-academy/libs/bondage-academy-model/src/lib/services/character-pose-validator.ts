import { RequiredPoses, itemConfigs } from "../config/item-config";
import { Character } from "../model/character";
import { CharacterPose } from "../model/character-pose";

export class CharacterPoseValidator {
  canChangeToPose(character: Character, pose: CharacterPose): boolean {
    const requiredPoses = this.getRequiredPoses(character);

    return (
      (!requiredPoses.fullBody ||
        !pose.fullBody ||
        requiredPoses.fullBody.includes(pose.fullBody)) &&
      (!requiredPoses.upperBody ||
        !pose.upperBody ||
        requiredPoses.upperBody.includes(pose.upperBody)) &&
      (!requiredPoses.lowerBody ||
        !pose.lowerBody ||
        requiredPoses.lowerBody.includes(pose.lowerBody)) &&
      (!requiredPoses.head || requiredPoses.head.includes(pose.head))
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
    second: RequiredPoses
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
    secondArray: T[] | undefined
  ): T[] | undefined {
    if (firstArray !== undefined && secondArray !== undefined) {
      return firstArray.filter((value) => secondArray.includes(value));
    }
    return firstArray || secondArray;
  }
}
