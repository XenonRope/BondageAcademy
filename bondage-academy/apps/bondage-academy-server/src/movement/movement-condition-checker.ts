import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";

@singleton()
export class MovementConditionChecker {
  constructor(
    @inject(MinigameService)
    private minigameService: MinigameService,
  ) {}

  canPlayerMove(playerId: number): boolean {
    return this.minigameService.getMinigamesByPlayerId(playerId).length === 0;
  }
}
