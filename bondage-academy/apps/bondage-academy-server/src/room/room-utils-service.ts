import { Player, RoomState } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomUtilsService {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(MinigameService)
    private minigameService: MinigameService,
  ) {}

  async getRoomState(roomId: number): Promise<RoomState> {
    const room = await this.roomStoreService.get(roomId);
    const players = await this.getPlayersInRoom(room.id);
    const minigames = this.minigameService.getMinigamesByRoomId(roomId);

    return { room, players, minigames };
  }

  async getPlayersInRoom(roomId: number): Promise<Player[]> {
    const playersIds = await this.roomStoreService.getPlayersIdsInRoom(roomId);
    return await this.playerStoreService.getPlayersByIds(playersIds);
  }
}
