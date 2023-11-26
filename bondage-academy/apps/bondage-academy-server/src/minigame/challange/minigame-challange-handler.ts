import {
  Minigame,
  MinigameChallange,
} from "@bondage-academy/bondage-academy-model";
import { MinigameResult } from "../model/minigame-result";

export interface MinigameChallangeHandler<T extends MinigameChallange> {
  canHandleChallange(challange: MinigameChallange): challange is T;

  onTimeEnd(minigame: Minigame, challange: T): Promise<MinigameResult>;
}
