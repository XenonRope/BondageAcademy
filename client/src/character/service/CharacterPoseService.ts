import { type SocketService } from "../../common/SocketService";
import type { Character } from "../model/Character";
import {
  LowerBodyPose,
  UpperBodyPose,
  type CharacterPose,
  type FullBodyPose,
  type HeadPose,
} from "../model/CharacterPose";

export class CharacterPoseService {
  constructor(private socketService: SocketService) {}

  async changeFullBodyPose(character: Character, pose: FullBodyPose) {
    await this.changePose({
      ...character.pose,
      fullBody: pose,
      upperBody: undefined,
      lowerBody: undefined,
    });
  }

  async changeUpperBodyPose(character: Character, pose: UpperBodyPose) {
    await this.changePose(
      "fullBody" in character.pose
        ? {
            ...character.pose,
            upperBody: pose,
            lowerBody: LowerBodyPose.Stand,
            fullBody: undefined,
          }
        : { ...character.pose, upperBody: pose },
    );
  }

  async changeLowerBodyPose(character: Character, pose: LowerBodyPose) {
    await this.changePose(
      "fullBody" in character.pose
        ? {
            ...character.pose,
            upperBody: UpperBodyPose.Crossed,
            lowerBody: pose,
            fullBody: undefined,
          }
        : { ...character.pose, lowerBody: pose },
    );
  }

  async changeHeadPose(character: Character, pose: HeadPose) {
    await this.changePose({
      ...character.pose,
      head: pose,
    });
  }

  async changePose(pose: CharacterPose): Promise<void> {
    await this.socketService.emit("change_pose", { pose });
  }
}
