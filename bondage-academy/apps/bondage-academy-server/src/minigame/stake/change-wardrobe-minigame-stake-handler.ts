import {
  ChangeWardrobeMinigameStake,
  Minigame,
  MinigameStake,
  isChangeWardrobeMinigameStake,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { WardrobeService } from "../../wardrobe/wardrobe-service";
import { MinigameResult, MinigameWinner } from "../model/minigame-result";
import { MinigameStakeHandler } from "./minigame-stake-handler";

@singleton()
export class ChangeWardrobeMinigameStakeHandler
  implements MinigameStakeHandler<ChangeWardrobeMinigameStake>
{
  constructor(
    @inject(WardrobeService) private wardrobeService: WardrobeService,
  ) {}

  canHandleStake(stake: MinigameStake): stake is ChangeWardrobeMinigameStake {
    return isChangeWardrobeMinigameStake(stake);
  }

  async handle(
    minigame: Minigame,
    stake: ChangeWardrobeMinigameStake,
    result: MinigameResult,
  ): Promise<void> {
    if (result.winner !== MinigameWinner.Agent) {
      return;
    }
    if (!minigame.target) {
      throw new Error("Target not found");
    }
    return await this.wardrobeService.wear({
      actor: minigame.actor,
      target: minigame.target,
      slot: stake.slot,
      item: stake.item,
    });
  }
}
