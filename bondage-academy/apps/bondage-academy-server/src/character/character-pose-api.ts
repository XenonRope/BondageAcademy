import {
  CharacterPose,
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { parseEnum, parseOptionalEnum } from "../api/utils/parsers";
import { Session } from "../session/model/session";
import { CharacterPoseService } from "./character-pose-service";

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
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }

    await this.characterPoseService.changePose(session.playerId, pose);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
