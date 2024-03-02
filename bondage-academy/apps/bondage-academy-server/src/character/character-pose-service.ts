import {
  CharacterPose,
  CharacterPoseValidator,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ActorData } from "../actor/actor-data";
import { ActorService } from "../actor/actor-service";
import { Logger } from "../log/logger";

@singleton()
export class CharacterPoseService {
  constructor(
    @inject(CharacterPoseValidator)
    private characterPoseValidator: CharacterPoseValidator,
    @inject(ActorService)
    private actorService: ActorService,
    @inject(Logger)
    private logger: Logger,
  ) {}

  async changePose(actor: ActorData, pose: CharacterPose): Promise<boolean> {
    if (!this.characterPoseValidator.isPoseValid(actor.character, pose)) {
      this.logger.warn(`Cannot change pose`);
      return false;
    }

    await this.updatePose(actor, pose);
    await this.actorService.synchronizeActorWithClient(actor.actor, {
      pose,
    });

    return true;
  }

  async updatePose(actor: ActorData, pose: CharacterPose): Promise<void> {
    await this.actorService.updatePose(actor.actor, pose);
  }
}
