import { arePositionsEqual, type Position } from "../common/model/Position";
import { type PlayerObject } from "../world/model/PlayerObject";
import { type World } from "../world/model/World";
import { worldService, type WorldService } from "../world/WorldService";

const PLAYER_MOVE_DURATION = 500;

export class MovementService {
  constructor(private worldService: WorldService) {}

  async setPlayerTargetPosition(
    world: World,
    playerObject: PlayerObject,
    targetPosition: Position
  ): Promise<void> {
    playerObject.targetPosition = targetPosition;
    if (playerObject.motionEndEvent == null) {
      await this.movePlayerTowardsTargetPosition(world, playerObject);
    }
  }

  private async movePlayerTowardsTargetPosition(
    world: World,
    playerObject: PlayerObject
  ): Promise<void> {
    if (playerObject.targetPosition == null) {
      playerObject.motionEndEvent = undefined;
      return;
    }
    const newPosition = this.moveTowards(
      world,
      playerObject.position,
      playerObject.targetPosition
    );
    if (arePositionsEqual(playerObject.position, newPosition)) {
      playerObject.motionEndEvent = undefined;
      playerObject.targetPosition = undefined;
      return;
    }
    playerObject.position = newPosition;
    playerObject.motionEndEvent = setTimeout(() => {
      this.movePlayerTowardsTargetPosition(world, playerObject).catch(
        console.log
      );
    }, PLAYER_MOVE_DURATION);

    for (const session of this.worldService.getSessionsFromWorld(world)) {
      session.socket.emit("move_player", {
        objectId: playerObject.id,
        position: newPosition,
        duration: PLAYER_MOVE_DURATION,
      });
    }
  }

  private moveTowards(world: World, start: Position, end: Position): Position {
    let deltaX = Math.min(1, Math.max(-1, end.x - start.x));
    if (
      !this.worldService.isFieldFree(world, { x: start.x + deltaX, y: start.y })
    ) {
      deltaX = 0;
    }
    let deltaY = Math.min(1, Math.max(-1, end.y - start.y));
    if (
      !this.worldService.isFieldFree(world, { x: start.x, y: start.y + deltaY })
    ) {
      deltaY = 0;
    }

    const newPosition = { x: start.x + deltaX, y: start.y + deltaY };
    if (
      deltaX !== 0 &&
      deltaY !== 0 &&
      !this.worldService.isFieldFree(world, newPosition)
    ) {
      if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
        return { x: start.x + deltaX, y: start.y };
      } else {
        return { x: start.x, y: start.y + deltaY };
      }
    } else {
      return newPosition;
    }
  }
}

export const movementService = new MovementService(worldService);
