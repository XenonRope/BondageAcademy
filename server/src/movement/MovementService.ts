import { arePositionsEqual, type Position } from "../common/model/Position";
import { type PlayerObject } from "../world/model/PlayerObject";
import { type World } from "../world/model/World";
import { worldService, type WorldService } from "../world/WorldService";

const PLAYER_MOVE_DURATION = 500;

export class MovementService {
  constructor(private worldService: WorldService) {}

  setPlayerTargetPosition(
    world: World,
    playerObject: PlayerObject,
    targetPosition: Position
  ): void {
    playerObject.targetPosition = targetPosition;
    if (playerObject.motionEndEvent == null) {
      this.movePlayerTowardsTargetPosition(world, playerObject);
    }
  }

  private movePlayerTowardsTargetPosition(
    world: World,
    playerObject: PlayerObject
  ): void {
    if (playerObject.targetPosition == null) {
      playerObject.motionEndEvent = undefined;
      return;
    }
    if (arePositionsEqual(playerObject.position, playerObject.targetPosition)) {
      playerObject.motionEndEvent = undefined;
      playerObject.targetPosition = undefined;
      return;
    }
    const newPosition = this.moveTowards(
      playerObject.position,
      playerObject.targetPosition
    );
    playerObject.position = newPosition;
    playerObject.motionEndEvent = setTimeout(() => {
      this.movePlayerTowardsTargetPosition(world, playerObject);
    }, PLAYER_MOVE_DURATION);

    for (const session of this.worldService.getSessionsFromWorld(world)) {
      session.socket.emit("move_player", {
        objectId: playerObject.id,
        position: newPosition,
        duration: PLAYER_MOVE_DURATION,
      });
    }
  }

  private moveTowards(start: Position, end: Position): Position {
    const position = { ...start };
    if (end.x > start.x) {
      position.x++;
    } else if (end.x < start.x) {
      position.x--;
    }
    if (end.y > start.y) {
      position.y++;
    } else if (end.y < start.y) {
      position.y--;
    }
    return position;
  }
}

export const movementService = new MovementService(worldService);
