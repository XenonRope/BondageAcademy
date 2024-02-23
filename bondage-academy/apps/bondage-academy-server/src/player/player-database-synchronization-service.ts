import { inject, singleton } from "tsyringe";
import { PlayerService } from "./player-service";
import { PlayerStoreService } from "./player-store-service";

@singleton()
export class PlayerDatabaseSynchronizationService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(PlayerService)
    private playerService: PlayerService,
  ) {}

  async synchronize(): Promise<void> {
    const players = this.playerStoreService.save();
    console.log("[Synchronization][Players] Count: " + players.length);
    if (players.length !== 0) {
      await this.playerService.updatePlayersInBulk(players);
    }
  }
}
