import {
  Player,
  RoomState,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { MinigameService } from "../minigame/minigame-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "./room-store-service";

export class RoomUtilsService {
  constructor(
    private roomStoreService: RoomStoreService,
    private playerStoreService: PlayerStoreService,
    private minigameService: MinigameService
  ) {}

  async getRoomState(roomId: number): Promise<RoomState> {
    const room = await this.roomStoreService.get(roomId);
    const players = await this.getPlayersInRoom(room.id);
    const minigames = this.minigameService.getMinigamesByRoomId(roomId);

    return { room, players, minigames };
  }

  async getPlayersInRoom(roomId: number): Promise<Player[]> {
    const room = await this.roomStoreService.get(roomId);
    const playersIds = room.objects.flatMap((object) =>
      isPlayerObject(object) ? [object.playerId] : []
    );
    return await this.playerStoreService.getAll(playersIds);
  }
}
