import { Minigame } from "../model/minigame";

export interface SynchronizeMinigamesEvent {
  replaceMinigames?: Minigame[];
  removeMinigames?: number[];
  updateMinigames?: UpdateMinigame[];
}

export interface UpdateMinigame {
  id: number;
}
