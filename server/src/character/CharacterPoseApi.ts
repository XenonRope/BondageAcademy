import { parseEnum, parseOptionalEnum } from "../common/Parsers";
import { type Session } from "../session/model/Session";
import { type CharacterPoseService } from "./CharacterPoseService";
import {
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
  type CharacterPose,
} from "./model/CharacterPose";

export interface ChangePoseRequest {
  pose: CharacterPose;
}

export class CharacterPoseApi {
  constructor(private characterPoseService: CharacterPoseService) {}

  async changePose(
    request: ChangePoseRequest,
    session: Session
  ): Promise<void> {
    const pose = this.parseCharacterPose(request.pose);
    if (session.playerObject == null || session.world == null) {
      throw new Error("Player is not in the world");
    }

    await this.characterPoseService.changePose(
      session.world,
      session.playerObject,
      pose
    );
  }

  private parseCharacterPose(value: any): CharacterPose {
    if (!(typeof value === "object") || value == null) {
      throw new Error("Only object can be parsed as CharacterPose");
    }

    const head: HeadPose = parseEnum(value.head, HeadPose);
    const fullBody: FullBodyPose | undefined = parseOptionalEnum(
      value.fullBody,
      FullBodyPose
    );
    const upperBody: UpperBodyPose | undefined = parseOptionalEnum(
      value.upperBody,
      UpperBodyPose
    );
    const lowerBody: LowerBodyPose | undefined = parseOptionalEnum(
      value.lowerBody,
      LowerBodyPose
    );
    if (fullBody != null) {
      return { head, fullBody };
    }
    if (upperBody != null && lowerBody != null) {
      return { head, upperBody, lowerBody };
    }

    throw new Error(
      "FullBodyPose or UpperBodyPose and LowerBodyPose are required"
    );
  }
}
