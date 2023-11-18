import { type PlayerService } from "../player/PlayerService";
import { type PlayerStoreService } from "../player/PlayerStoreService";

export class PlayerSynchronizationService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private playerService: PlayerService
  ) {}

  async synchronize(): Promise<void> {
    const players = this.playerStoreService.save();
    console.log("[Synchronization][Players] Count: " + players.length);
    if (players.length !== 0) {
      await this.playerService.updatePlayersInBulk(players);
    }
  }
}
