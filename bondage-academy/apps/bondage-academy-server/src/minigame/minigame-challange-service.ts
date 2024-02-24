import {
  Minigame,
  MinigameChallange,
} from "@bondage-academy/bondage-academy-model";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { ClickMinigameChallangeHandler } from "./challange/click-minigame-challange-handler";
import { MinigameChallangeHandler } from "./challange/minigame-challange-handler";
import { MinigameProgressChange } from "./model/minigame-progress-change";
import { MinigameResult } from "./model/minigame-result";
import { token } from "../app/token";

const MINIGAME_CHALLANGE_HANDLERS = token<
  MinigameChallangeHandler<MinigameChallange>[]
>("minigameChallangeHandlers");

@singleton()
@registry([
  {
    token: MINIGAME_CHALLANGE_HANDLERS,
    useFactory: instanceCachingFactory((container) => [
      container.resolve(ClickMinigameChallangeHandler),
    ]),
  },
])
export class MinigameChallangeService {
  constructor(
    @inject(MINIGAME_CHALLANGE_HANDLERS)
    private minigameChallangeHandlers: MinigameChallangeHandler<MinigameChallange>[],
  ) {}

  async changeProgress(
    minigame: Minigame,
    progressChange: MinigameProgressChange,
  ): Promise<MinigameResult | undefined> {
    const handler = this.findHandler(minigame);
    return await handler.onProgressChange(
      minigame,
      minigame.challange,
      progressChange,
    );
  }

  async getResultAfterTimeEnd(minigame: Minigame): Promise<MinigameResult> {
    const handler = this.findHandler(minigame);
    return await handler.onTimeEnd(minigame, minigame.challange);
  }

  private findHandler(
    minigame: Minigame,
  ): MinigameChallangeHandler<MinigameChallange> {
    const handler = this.minigameChallangeHandlers.find((handler) =>
      handler.canHandleChallange(minigame.challange),
    );
    if (!handler) {
      throw new Error(
        "No handler found for challange " + minigame.challange.type,
      );
    }
    return handler;
  }
}
