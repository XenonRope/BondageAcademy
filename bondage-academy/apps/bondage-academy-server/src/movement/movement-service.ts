import {
  EventFromServer,
  PlayerObject,
  Position,
  Room,
  RoomUtils,
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
    const room = await this.roomStoreService.get(roomId);
    this.assertPositionIsInRoomBounds(targetPosition, room);
    const playerObject = RoomUtils.getPlayerObjectByPlayerId(room, playerId);
    const motion = this.motionStorage.getOrCreateMotionByObjectId(
      playerObject.id,
    );
    motion.targetPosition = targetPosition;
    if (motion.motionEndEvent == null) {
      await this.movePlayerTowardsTargetPosition(room, playerObject, motion);
    }
  }

  private assertPositionIsInRoomBounds(position: Position, room: Room): void {
    const { width, height } = room;
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= width ||
      position.y >= height
    ) {
      throw new Error("Position is out of bounds");
    }
  }

  private async movePlayerTowardsTargetPositionLoop(
    roomId: number,
    playerId: number,
    motion: Motion,
  ): Promise<void> {
    const room = await this.roomStoreService.get(roomId);
    const playerObject = RoomUtils.getPlayerObjectByPlayerId(room, playerId);
    await this.movePlayerTowardsTargetPosition(room, playerObject, motion);
  }

  private async movePlayerTowardsTargetPosition(
    room: Room,
    playerObject: PlayerObject,
    motion: Motion,
  ): Promise<void> {
    if (motion.targetPosition == null) {
      this.motionStorage.stopMotion(playerObject.id);
      return;
    }
    if (!this.movementConditionChecker.canPlayerMove(playerObject?.playerId)) {
      this.motionStorage.stopMotion(playerObject.id);
      return;
    }
    const currentPosition = playerObject.position;
    const newPosition = this.moveTowards(
      room,
      currentPosition,
      motion.targetPosition,
    );
    if (arePositionsEqual(currentPosition, newPosition)) {
      this.motionStorage.stopMotion(playerObject.id);
      return;
    }

    await this.roomStoreService.updateObjectPostion(
      room.id,
      playerObject.id,
      newPosition,
    );

    motion.motionEndEvent = setTimeout(() => {
      this.movePlayerTowardsTargetPositionLoop(
        room.id,
        playerObject.playerId,
        motion,
      ).catch(this.logger.error.bind(this.logger));
    }, PLAYER_MOVE_DURATION);

    const sessions = this.roomSessionService.getSessionsInRoom(room);
    for (const session of sessions) {
      session.socket.emit(EventFromServer.MovePlayer, {
        objectId: playerObject.id,
        position: newPosition,
        duration: PLAYER_MOVE_DURATION,
      });
    }
  }

  private moveTowards(room: Room, start: Position, end: Position): Position {
    let deltaX = Math.min(1, Math.max(-1, end.x - start.x));
    if (
      !this.roomFieldService.isFieldFree(room, {
        x: start.x + deltaX,
        y: start.y,
      })
    ) {
      deltaX = 0;
    }
    let deltaY = Math.min(1, Math.max(-1, end.y - start.y));
    if (
      !this.roomFieldService.isFieldFree(room, {
        x: start.x,
        y: start.y + deltaY,
      })
    ) {
      deltaY = 0;
    }

    const newPosition = { x: start.x + deltaX, y: start.y + deltaY };
    if (
      deltaX !== 0 &&
      deltaY !== 0 &&
      !this.roomFieldService.isFieldFree(room, newPosition)
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
