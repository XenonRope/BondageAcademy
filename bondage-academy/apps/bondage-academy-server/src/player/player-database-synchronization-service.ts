import { inject, singleton } from "tsyringe";
import { PlayerService } from "./player-service";
import { PlayerStoreService } from "./player-store-service";
import { Logger } from "../log/logger";

@singleton()
export class PlayerDatabaseSynchronizationService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(PlayerService)
    private playerService: PlayerService,
    @inject(Logger)
    private logger: Logger,
  ) {}

  async synchronize(): Promise<void> {
    const players = this.playerStoreService.save();
    this.logger.info("[Synchronization][Players] Count: " + players.length);
    if (players.length !== 0) {
      await this.playerService.updatePlayersInBulk(players);
    }
  }
}
