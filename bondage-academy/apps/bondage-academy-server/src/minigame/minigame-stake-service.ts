import {
  Minigame,
  MinigameStake,
} from "@bondage-academy/bondage-academy-model";
import { MinigameResult } from "./model/minigame-result";
import { MinigameStakeHandler } from "./stake/minigame-stake-handler";

export class MinigameStakeService {
  constructor(private handlers: MinigameStakeHandler<MinigameStake>[]) {}

  async executeStake(
    minigame: Minigame,
    result: MinigameResult
  ): Promise<void> {
    const stake = this.findHandler(minigame);
    await stake.handle(minigame, minigame.stake, result);
  }

  private findHandler(minigame: Minigame): MinigameStakeHandler<MinigameStake> {
    const handler = this.handlers.find((handler) =>
      handler.canHandleStake(minigame.stake)
    );
    if (!handler) {
      throw new Error("No handler found for stake " + minigame.stake.type);
    }
    return handler;
  }
}
