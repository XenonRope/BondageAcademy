import {
  PlayerObject,
  Position,
  World,
  arePositionsEqual,
} from "@bondage-academy/bondage-academy-model";
import { type WorldService } from "../world/world-service";
import type { Motion } from "./model/motion";
import type { MotionStorage } from "./motion-storage";

const PLAYER_MOVE_DURATION = 500;

export class MovementService {
  constructor(
    private worldService: WorldService,
    private motionStorage: MotionStorage
  ) {}

  async setPlayerTargetPosition(
    world: World,
    playerObject: PlayerObject,
    targetPosition: Position
  ): Promise<void> {
    const motion = this.motionStorage.getOrCreateMotionByObjectId(
      playerObject.id
    );
    motion.targetPosition = targetPosition;
    if (motion.motionEndEvent == null) {
      await this.movePlayerTowardsTargetPosition(world, playerObject, motion);
    }
  }

  private async movePlayerTowardsTargetPosition(
    world: World,
    playerObject: PlayerObject,
    motion: Motion
  ): Promise<void> {
    if (motion.targetPosition == null) {
      this.motionStorage.stopMotion(playerObject.id);
      return;
    }
    const newPosition = this.moveTowards(
      world,
      playerObject.position,
      motion.targetPosition
    );
    if (arePositionsEqual(playerObject.position, newPosition)) {
      this.motionStorage.stopMotion(playerObject.id);
      return;
    }
    playerObject.position = newPosition;
    motion.motionEndEvent = setTimeout(() => {
      this.movePlayerTowardsTargetPosition(world, playerObject, motion).catch(
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
