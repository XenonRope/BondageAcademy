import {
  EventFromServer,
  Position,
  arePositionsEqual,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { Logger } from "../log/logger";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomFieldService } from "../room/room-field-service";
import { RoomSessionService } from "../room/room-session-service";
import { RoomStoreService } from "../room/room-store-service";
import type { Motion } from "./model/motion";
import { MotionStorage } from "./motion-storage";
import { MovementConditionChecker } from "./movement-condition-checker";

const PLAYER_MOVE_DURATION = 350;

@singleton()
export class MovementService {
  constructor(
    @inject(MotionStorage)
    private motionStorage: MotionStorage,
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomFieldService)
    private roomFieldService: RoomFieldService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(MovementConditionChecker)
    private movementConditionChecker: MovementConditionChecker,
    @inject(Logger)
    private logger: Logger,
  ) {}

  async setPlayerTargetPosition(
    playerId: number,
    targetPosition: Position,
  ): Promise<void> {
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
      throw new Error(`Player ${playerId} is not in a room`);
    }
    await this.assertPositionIsInRoomBounds(targetPosition, roomId);
    const playerObject = await this.roomStoreService.getPlayerObjectByPlayerId(
      roomId,
      playerId,
    );
    if (!playerObject) {
      throw new Error(
        `Player ${playerId} does not have player object in room ${roomId}`,
      );
    }
    const motion = this.motionStorage.getOrCreateMotionByObjectId(
      playerObject.id,
    );
    motion.targetPosition = targetPosition;
    if (motion.motionEndEvent == null) {
      await this.movePlayerTowardsTargetPosition(
        roomId,
        playerObject.id,
        motion,
      );
    }
  }

  private async assertPositionIsInRoomBounds(
    position: Position,
    roomId: number,
  ) {
    const { width, height } = await this.roomStoreService.getRoomSize(roomId);
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= width ||
      position.y >= height
    ) {
      throw new Error("Position is out of bounds");
    }
  }

  private async movePlayerTowardsTargetPosition(
    roomId: number,
    objectId: number,
    motion: Motion,
  ): Promise<void> {
    if (motion.targetPosition == null) {
      this.motionStorage.stopMotion(objectId);
      return;
    }
    const object = await this.roomStoreService.getObjectById(roomId, objectId);
    if (!object) {
      this.motionStorage.stopMotion(objectId);
      return;
    }
    if (!this.movementConditionChecker.canObjectMove(object)) {
      this.motionStorage.stopMotion(objectId);
      return;
    }
    const newPosition = await this.moveTowards(
      roomId,
      object.position,
      motion.targetPosition,
    );
    if (arePositionsEqual(object.position, newPosition)) {
      this.motionStorage.stopMotion(objectId);
      return;
    }

    await this.roomStoreService.update(roomId, (room) => {
      const object = room.objects.find((object) => object.id === objectId);
      if (object) {
        object.position = newPosition;
      }
    });

    motion.motionEndEvent = setTimeout(() => {
      this.movePlayerTowardsTargetPosition(roomId, objectId, motion).catch(
        this.logger.error.bind(this.logger),
      );
    }, PLAYER_MOVE_DURATION);

    const sessions = await this.roomSessionService.getSessionsInRoom(roomId);
    for (const session of sessions) {
      session.socket.emit(EventFromServer.MovePlayer, {
        objectId,
        position: newPosition,
        duration: PLAYER_MOVE_DURATION,
      });
    }
  }

  private async moveTowards(
    roomId: number,
    start: Position,
    end: Position,
  ): Promise<Position> {
    let deltaX = Math.min(1, Math.max(-1, end.x - start.x));
    if (
      !(await this.roomFieldService.isFieldFree(roomId, {
        x: start.x + deltaX,
        y: start.y,
      }))
    ) {
      deltaX = 0;
    }
    let deltaY = Math.min(1, Math.max(-1, end.y - start.y));
    if (
      !(await this.roomFieldService.isFieldFree(roomId, {
        x: start.x,
        y: start.y + deltaY,
      }))
    ) {
      deltaY = 0;
    }

    const newPosition = { x: start.x + deltaX, y: start.y + deltaY };
    if (
      deltaX !== 0 &&
      deltaY !== 0 &&
      !(await this.roomFieldService.isFieldFree(roomId, newPosition))
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
