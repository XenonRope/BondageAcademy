import {
  GameObject,
  Room,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { BusinessError } from "../api/model/business-error";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomObjectRemovalService } from "./room-object-removal-service";
import { RoomStoreService } from "./room-store-service";

export class RoomLeaveService {
  constructor(
    private roomObjectRemovalService: RoomObjectRemovalService,
    private playerStoreService: PlayerStoreService,
    private roomStoreService: RoomStoreService
  ) {}

  async leaveRoom(playerId: number): Promise<void> {
    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      throw new Error(`Player ${player.id} is not in a room`);
    }
    const room = await this.roomStoreService.get(player.roomId);
    const playerObject = room.objects.find(
      (object) => isPlayerObject(object) && object.playerId === playerId
    );
    if (!playerObject) {
      throw new Error(
        `Player ${player.id} does not have player object in room ${player.roomId}`
      );
    }
    if (!this.isObjectInTransitArea(playerObject, room)) {
      throw new BusinessError(`playerIsNotInTransitArea`);
    }
    await this.roomObjectRemovalService.removeObject(room.id, playerObject.id);
    await this.playerStoreService.update(playerId, (player) => {
      player.roomId = undefined;
    });
  }

  private isObjectInTransitArea(object: GameObject, room: Room): boolean {
    for (const transitArea of room.transitAreas) {
      if (
        object.position.x >= transitArea.x &&
        object.position.x < transitArea.x + transitArea.width &&
        object.position.y >= transitArea.y &&
        object.position.y < transitArea.y + transitArea.height
      ) {
        return true;
      }
    }
    return false;
  }
}
