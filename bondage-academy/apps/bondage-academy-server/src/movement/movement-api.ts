import { Position } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { requiredPosition } from "../api/utils/validators";
import { MinigameService } from "../minigame/minigame-service";
import { type Session } from "../session/model/session";
import { MovementService } from "./movement-service";

@singleton()
export class MovementApi {
  constructor(
    @inject(MovementService)
    private movementService: MovementService,
    @inject(MinigameService)
    private minigameService: MinigameService,
  ) {}

  async setPlayerTargetPosition(
    targetPosition: Position,
    session: Session,
  ): Promise<void> {
    requiredPosition(targetPosition);
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);

    await this.movementService.setPlayerTargetPosition(session.playerId, {
      x: targetPosition.x,
      y: targetPosition.y,
    });
  }
}
