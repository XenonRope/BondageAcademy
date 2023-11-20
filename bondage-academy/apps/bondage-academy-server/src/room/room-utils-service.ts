import {
  Player,
  Room,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "./room-store-service";

export class RoomUtilsService {
  constructor(
    private roomStoreService: RoomStoreService,
    private playerStoreService: PlayerStoreService
  ) {}

  async getRoomAndPlayers(
    roomId: number
  ): Promise<{ room: Room; players: Player[] }> {
    const room = await this.roomStoreService.get(roomId);
    const playersIds = room.objects.flatMap((object) =>
      isPlayerObject(object) ? [object.playerId] : []
    );
    const players = await this.playerStoreService.getAll(playersIds);

    return { room, players };
  }
}
