import { Store } from "../store/Store";
import { playerService, type PlayerService } from "./PlayerService";
import { type Player } from "./model/Player";

export class PlayerStoreService {
  private store: Store<number, Player>;

  constructor(playerService: PlayerService) {
    this.store = new Store((playerId) => playerService.getPlayer(playerId));
  }

  async getPlayer(id: number): Promise<Player> {
    return await this.store.get(id);
  }
}

export const playerStoreService = new PlayerStoreService(playerService);
