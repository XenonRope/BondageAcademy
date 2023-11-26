import {
  Minigame,
  Player,
  Room,
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

  async getRoomState(
    roomId: number
  ): Promise<{ room: Room; players: Player[]; minigames: Minigame[] }> {
    const room = await this.roomStoreService.get(roomId);
    const players = await this.getPlayersInRoom(room);
    const minigames = this.minigameService.getMinigamesByRoomId(roomId);

    return { room, players, minigames };
  }

  async getPlayersInRoom(room: Room): Promise<Player[]> {
    const playersIds = room.objects.flatMap((object) =>
      isPlayerObject(object) ? [object.playerId] : []
    );
    return await this.playerStoreService.getAll(playersIds);
  }
}
