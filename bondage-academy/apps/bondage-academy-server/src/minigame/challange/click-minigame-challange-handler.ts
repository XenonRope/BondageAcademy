import {
  ClickMinigameChallange,
  Minigame,
  MinigameChallange,
  isClickMinigameChallange,
} from "@bondage-academy/bondage-academy-model";
import { MinigameResult, MinigameWinner } from "../model/minigame-result";
import { MinigameChallangeHandler } from "./minigame-challange-handler";

export class ClickMinigameChallangeHandler
  implements MinigameChallangeHandler<ClickMinigameChallange>
{
  canHandleChallange(
    challange: MinigameChallange
  ): challange is ClickMinigameChallange {
    return isClickMinigameChallange(challange);
  }

  onTimeEnd(
    _minigame: Minigame,
    _challange: ClickMinigameChallange
  ): Promise<MinigameResult> {
    return Promise.resolve({
      winner: MinigameWinner.Agent,
    });
  }
}
