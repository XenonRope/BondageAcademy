import { playerService, type PlayerService } from "./PlayerService";
import { type Player } from "./model/Player";

export class PlayerStoreService {
  private players = new Map<number, Promise<Player>>();

  constructor(private playerService: PlayerService) {}

  async getPlayer(id: number): Promise<Player> {
    let playerPromise: Promise<Player> | undefined = this.players.get(id);
    if (playerPromise != null) {
      return await playerPromise;
    }
    playerPromise = this.playerService.getPlayer(id).then((player) => {
      if (player == null) {
        this.players.delete(id);
        throw new Error(`Player with id ${id} not found`);
      }
      return player;
    });
    this.players.set(id, playerPromise);
    return await playerPromise;
  }
}

export const playerStoreService = new PlayerStoreService(playerService);
