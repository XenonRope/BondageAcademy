import {
  Position,
  Room,
  arePositionsEqual,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomFieldService } from "../room/room-field-service";
import { RoomSessionService } from "../room/room-session-service";
import { RoomStoreService } from "../room/room-store-service";
import type { Motion } from "./model/motion";
import type { MotionStorage } from "./motion-storage";

const PLAYER_MOVE_DURATION = 500;

export class MovementService {
  constructor(
    private motionStorage: MotionStorage,
    private roomStoreService: RoomStoreService,
    private playerStoreService: PlayerStoreService,
    private roomFieldService: RoomFieldService,
    private roomSessionService: RoomSessionService
  ) {}

  async setPlayerTargetPosition(
    playerId: number,
    targetPosition: Position
  ): Promise<void> {
    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      return;
    }
    const room = await this.roomStoreService.get(player.roomId);
    this.assertPositionIsInRoomBounds(targetPosition, room);
    const playerObject = room.objects.find(
      (object) => isPlayerObject(object) && object.playerId === playerId
    );
    if (!playerObject) {
      return;
    }
    const motion = this.motionStorage.getOrCreateMotionByObjectId(
      playerObject.id
    );
    motion.targetPosition = targetPosition;
    if (motion.motionEndEvent == null) {
      await this.movePlayerTowardsTargetPosition(
        room.id,
        playerObject.id,
        motion
      );
    }
  }

  private assertPositionIsInRoomBounds(position: Position, room: Room) {
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= room.width ||
      position.y >= room.height
    ) {
      throw new Error("Position is out of bounds");
    }
  }

  private async movePlayerTowardsTargetPosition(
    roomId: number,
    objectId: number,
    motion: Motion
  ): Promise<void> {
    if (motion.targetPosition == null) {
      this.motionStorage.stopMotion(objectId);
      return;
    }
    const room = await this.roomStoreService.get(roomId);
    const object = room.objects.find((object) => object.id === objectId);
    if (!object) {
      this.motionStorage.stopMotion(objectId);
      return;
    }
    const newPosition = this.moveTowards(
      room,
      object.position,
      motion.targetPosition
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
        console.log
      );
    }, PLAYER_MOVE_DURATION);

    const sessions = await this.roomSessionService.getSessionsInRoom(roomId);
    for (const session of sessions) {
      session.socket.emit("move_player", {
        objectId,
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