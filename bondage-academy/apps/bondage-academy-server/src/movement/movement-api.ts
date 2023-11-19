import { Position } from "@bondage-academy/bondage-academy-model";
import { requiredPosition } from "../api/utils/validators";
import { type Session } from "../session/model/session";
import { type MovementService } from "./movement-service";

export class MovementApi {
  constructor(private movementService: MovementService) {}

  async setPlayerTargetPosition(
    targetPosition: Position,
    session: Session
  ): Promise<void> {
    requiredPosition(targetPosition);
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }

    await this.movementService.setPlayerTargetPosition(session.playerId, {
      x: targetPosition.x,
      y: targetPosition.y,
    });
  }
}
