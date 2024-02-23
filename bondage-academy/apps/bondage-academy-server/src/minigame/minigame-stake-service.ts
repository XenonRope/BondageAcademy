import {
  Minigame,
  MinigameStake,
} from "@bondage-academy/bondage-academy-model";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { MinigameResult } from "./model/minigame-result";
import { ChangeWardrobeMinigameStakeHandler } from "./stake/change-wardrobe-minigame-stake-handler";
import { MinigameStakeHandler } from "./stake/minigame-stake-handler";

@registry([
  {
    token: "minigameStakeHandlers",
    useFactory: instanceCachingFactory((container) => {
      [container.resolve(ChangeWardrobeMinigameStakeHandler)];
    }),
  },
])
@singleton()
export class MinigameStakeService {
  constructor(
    @inject("minigameStakeHandlers")
    private minigameStakeHandlers: MinigameStakeHandler<MinigameStake>[],
  ) {}

  async executeStake(
    minigame: Minigame,
    result: MinigameResult,
  ): Promise<void> {
    const stake = this.findHandler(minigame);
    await stake.handle(minigame, minigame.stake, result);
  }

  private findHandler(minigame: Minigame): MinigameStakeHandler<MinigameStake> {
    const handler = this.minigameStakeHandlers.find((handler) =>
      handler.canHandleStake(minigame.stake),
    );
    if (!handler) {
      throw new Error("No handler found for stake " + minigame.stake.type);
    }
    return handler;
  }
}
