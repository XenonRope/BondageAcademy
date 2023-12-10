import { itemConfigs } from "../config/item-config";
import { Character } from "../model/character";
import { CharacterPose } from "../model/character-pose";

export class CharacterPoseValidator {
  canChangeToPose(character: Character, pose: CharacterPose): boolean {
    for (const equippedItem of Object.values(character.wearables)) {
      if (!equippedItem) {
        continue;
      }
      const requiredPoses = itemConfigs[equippedItem.item.code].requiredPoses;
      if (!requiredPoses) {
        continue;
      }
      if (
        requiredPoses.fullBody &&
        (!pose.fullBody || !requiredPoses.fullBody.includes(pose.fullBody))
      ) {
        return false;
      }
      if (
        requiredPoses.upperBody &&
        (!pose.upperBody || !requiredPoses.upperBody.includes(pose.upperBody))
      ) {
        return false;
      }
      if (
        requiredPoses.lowerBody &&
        (!pose.lowerBody || !requiredPoses.lowerBody.includes(pose.lowerBody))
      ) {
        return false;
      }
      if (requiredPoses.head && !requiredPoses.head.includes(pose.head)) {
        return false;
      }
    }

    return true;
  }
}
