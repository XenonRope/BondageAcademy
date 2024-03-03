import {
  GameObject,
  Room,
  RoomUtils,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { BusinessError } from "../api/model/business-error";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomObjectRemovalService } from "./room-object-removal-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomLeaveService {
  constructor(
    @inject(RoomObjectRemovalService)
    private roomObjectRemovalService: RoomObjectRemovalService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
  ) {}

  async leaveRoom(playerId: number): Promise<void> {
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
      throw new Error(`Player ${playerId} is not in a room`);
    }
    const room = await this.roomStoreService.get(roomId);
    const playerObject = RoomUtils.getPlayerObjectByPlayerId(room, playerId);
    if (!playerObject) {
      throw new Error(
        `Player ${playerId} does not have player object in room ${room.id}`,
      );
    }
    if (!this.isObjectInTransitArea(playerObject, room)) {
      throw new BusinessError(`playerIsNotInTransitArea`);
    }
    await this.roomObjectRemovalService.removeObject(room, playerObject.id);
    await this.playerStoreService.updateRoomId(playerId, undefined);
  }

  private isObjectInTransitArea(object: GameObject, room: Room): boolean {
    const position = object.position;
    for (const transitArea of room.transitAreas) {
      if (
        position.x >= transitArea.x &&
        position.x < transitArea.x + transitArea.width &&
        position.y >= transitArea.y &&
        position.y < transitArea.y + transitArea.height
      ) {
        return true;
      }
    }
    return false;
  }
}
