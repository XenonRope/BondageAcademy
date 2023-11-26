import {
  Minigame,
  MinigameChallange,
} from "@bondage-academy/bondage-academy-model";
import { MinigameChallangeHandler } from "./challange/minigame-challange-handler";
import { MinigameResult } from "./model/minigame-result";

export class MinigameChallangeService {
  constructor(
    private handlers: MinigameChallangeHandler<MinigameChallange>[]
  ) {}

  async getResultAfterTimeEnd(minigame: Minigame): Promise<MinigameResult> {
    const handler = this.findHandler(minigame);
    return await handler.onTimeEnd(minigame, minigame.challange);
  }

  private findHandler(
    minigame: Minigame
  ): MinigameChallangeHandler<MinigameChallange> {
    const handler = this.handlers.find((handler) =>
      handler.canHandleChallange(minigame.challange)
    );
    if (!handler) {
      throw new Error(
        "No handler found for challange " + minigame.challange.type
      );
    }
    return handler;
  }
}
