import {
  GameObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";

@singleton()
export class MovementConditionChecker {
  constructor(
    @inject(MinigameService) private minigameService: MinigameService,
  ) {}

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
