import { Minigame } from "@bondage-academy/bondage-academy-model";

export interface MinigameState {
  endTimeEvent: NodeJS.Timeout;
}

export interface MinigameWithState {
  minigame: Minigame;
  state: MinigameState;
}
