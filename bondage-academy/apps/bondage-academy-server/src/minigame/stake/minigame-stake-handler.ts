import {
  Minigame,
  MinigameStake,
} from "@bondage-academy/bondage-academy-model";
import { MinigameResult } from "../model/minigame-result";

export interface MinigameStakeHandler<T extends MinigameStake> {
  canHandleStake(stake: MinigameStake): stake is T;

  handle(minigame: Minigame, stake: T, result: MinigameResult): Promise<void>;
}
