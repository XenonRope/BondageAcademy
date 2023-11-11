import { requiredPosition } from "../common/Validators";
import { type Position } from "../common/model/Position";
import { type Session } from "../session/model/Session";
import { movementService, type MovementService } from "./MovementService";

export class MovementApi {
  constructor(private movementService: MovementService) {}

  async setPlayerTargetPosition(
    targetPosition: Position,
    session: Session
  ): Promise<void> {
    requiredPosition(targetPosition);
    if (session.playerObject == null || session.world == null) {
      throw new Error("Player is not in the world");
    }
    if (
      targetPosition.x < 0 ||
      targetPosition.y < 0 ||
      targetPosition.x >= session.world.width ||
      targetPosition.y >= session.world.height
    ) {
      throw new Error("Target position is out of bounds");
    }

    this.movementService.setPlayerTargetPosition(
      session.world,
      session.playerObject,
      { x: targetPosition.x, y: targetPosition.y }
    );
  }
}

export const movementApi = new MovementApi(movementService);
