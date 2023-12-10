import {
  AnyPose,
  Character,
  CharacterPose,
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
  isFullBodyPose,
  isLowerBodyPose,
  isUpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";

export class CharacterPoseService {
  constructor(private socketService: SocketService) {}

  setAnyPose(character: Character, pose: AnyPose): CharacterPose {
    if (isFullBodyPose(pose)) {
      return this.setFullBodyPose(character, pose);
    }
    if (isUpperBodyPose(pose)) {
      return this.setUpperBodyPose(character, pose);
    }
    if (isLowerBodyPose(pose)) {
      return this.setLowerBodyPose(character, pose);
    }
    return this.setHeadPose(character, pose);
  }

  setFullBodyPose(character: Character, pose: FullBodyPose): CharacterPose {
    return {
      ...character.pose,
      fullBody: pose,
      upperBody: undefined,
      lowerBody: undefined,
    };
  }

  setUpperBodyPose(character: Character, pose: UpperBodyPose): CharacterPose {
    return "fullBody" in character.pose
      ? {
          ...character.pose,
          upperBody: pose,
          lowerBody: LowerBodyPose.Stand,
          fullBody: undefined,
        }
      : { ...character.pose, upperBody: pose };
  }

  setLowerBodyPose(character: Character, pose: LowerBodyPose): CharacterPose {
    return "fullBody" in character.pose
      ? {
          ...character.pose,
          upperBody: UpperBodyPose.Crossed,
          lowerBody: pose,
          fullBody: undefined,
        }
      : { ...character.pose, lowerBody: pose };
  }

  setHeadPose(character: Character, pose: HeadPose): CharacterPose {
    return {
      ...character.pose,
      head: pose,
    };
  }

  async changePose(pose: CharacterPose): Promise<void> {
    await this.socketService.emit("change_pose", { pose });
  }
}
