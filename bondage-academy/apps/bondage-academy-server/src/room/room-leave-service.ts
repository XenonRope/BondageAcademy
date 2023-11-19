import { isPlayerObject } from "@bondage-academy/bondage-academy-model";
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
      return;
    }
    const room = await this.roomStoreService.get(player.roomId);
    const playerObject = room.objects.find(
      (object) => isPlayerObject(object) && object.playerId === playerId
    );
    if (playerObject) {
      await this.roomObjectRemovalService.removeObject(
        room.id,
        playerObject.id
      );
    }
    await this.playerStoreService.update(playerId, (player) => {
      player.roomId = undefined;
    });
  }
}
