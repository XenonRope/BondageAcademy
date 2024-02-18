import {
  Minigame,
  MinigameChallange,
} from "@bondage-academy/bondage-academy-model";
import { MinigameProgressChange } from "../model/minigame-progress-change";
import { MinigameResult } from "../model/minigame-result";

export interface MinigameChallangeHandler<T extends MinigameChallange> {
  canHandleChallange(challange: MinigameChallange): challange is T;

  onProgressChange(
    minigame: Minigame,
    challange: T,
    progressChange: MinigameProgressChange,
  ): Promise<MinigameResult | undefined>;

  onTimeEnd(minigame: Minigame, challange: T): Promise<MinigameResult>;
}
