import {
  CharacterPose,
  CharacterPoseValidator,
} from "@bondage-academy/bondage-academy-model";
import { ActorData } from "../actor/actor-data";
import { ActorService } from "../actor/actor-service";

export class CharacterPoseService {
  constructor(
    private characterPoseValidator: CharacterPoseValidator,
    private actorService: ActorService
  ) {}

  async changePose(actor: ActorData, pose: CharacterPose): Promise<boolean> {
    if (!this.characterPoseValidator.isPoseValid(actor.character, pose)) {
      console.error(`Cannot change pose`);
      return false;
    }

    await this.updatePose(actor, pose);
    await this.actorService.synchronizeActorWithClient(actor.actor, {
      pose,
    });

    return true;
  }

  async updatePose(actor: ActorData, pose: CharacterPose): Promise<void> {
    await this.actorService.updateActor(actor.actor, ({ character }) => {
      character.pose = pose;
    });
  }
}
