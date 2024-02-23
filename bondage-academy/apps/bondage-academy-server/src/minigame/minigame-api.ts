import {
  Minigame,
  MinigameProgessRequestSchema,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { inject, singleton } from "tsyringe";
import { Session } from "../session/model/session";
import { MinigameService } from "./minigame-service";
import { MinigameProgressChangeSource } from "./model/minigame-progress-change";

@singleton()
export class MinigameApi {
  constructor(
    @inject(MinigameService) private minigameService: MinigameService,
  ) {}

  async changeProgress(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    const { minigameId, progressChange } = await tPromise.decode(
      MinigameProgessRequestSchema,
      request,
    );
    const minigame = this.minigameService.getMinigame(minigameId);
    await this.minigameService.changeProgess(minigame, {
      value: progressChange,
      source: this.getProgressChangeSource(minigame, session.playerId),
    });
  }

  private getProgressChangeSource(
    minigame: Minigame,
    playerId: number,
  ): MinigameProgressChangeSource {
    if (isPlayerActor(minigame.actor) && minigame.actor.playerId === playerId) {
      return MinigameProgressChangeSource.Actor;
    }
    if (
      isPlayerActor(minigame.target) &&
      minigame.target.playerId === playerId
    ) {
      return MinigameProgressChangeSource.Target;
    }
    throw new Error(
      `Minigame with id ${minigame.id} does not contain player ${playerId}`,
    );
  }
}
