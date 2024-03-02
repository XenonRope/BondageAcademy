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
    const playerObjectId = await this.roomStoreService.getObjectIdByPlayerId(
      roomId,
      playerId,
    );
    if (!playerObjectId) {
      throw new Error(
        `Player ${playerId} does not have player object in room ${roomId}`,
      );
    }
    if (!(await this.isObjectInTransitArea(playerObjectId, roomId))) {
      throw new BusinessError(`playerIsNotInTransitArea`);
    }
    await this.roomObjectRemovalService.removeObject(roomId, playerObjectId);
    await this.playerStoreService.updateRoomId(playerId, undefined);
  }

  private async isObjectInTransitArea(
    objectId: number,
    roomId: number,
  ): Promise<boolean> {
    const transitAreas = await this.roomStoreService.getTransitAreas(roomId);
    const position = await this.roomStoreService.getPositionByObjectId(
      roomId,
      objectId,
    );
    if (!position) {
      throw new Error(
        `Cannot find position for object ${objectId} in room ${roomId}`,
      );
    }
    for (const transitArea of transitAreas) {
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
