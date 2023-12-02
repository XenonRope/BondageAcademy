import {
  GameObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { MinigameService } from "../minigame/minigame-service";

export class MovementConditionChecker {
  constructor(private minigameService: MinigameService) {}

  canObjectMove(object: GameObject): boolean {
    if (!isPlayerObject(object)) {
      return false;
    }
    return this.canPlayerMove(object.playerId);
  }

  private canPlayerMove(playerId: number): boolean {
    return this.minigameService.getMinigamesByPlayerId(playerId).length === 0;
  }
}
