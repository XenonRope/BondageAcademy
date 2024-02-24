import { inject, singleton } from "tsyringe";
import { Logger } from "../log/logger";
import { PlayerDatabaseSynchronizationService } from "../player/player-database-synchronization-service";
import { RoomDatabaseSynchronizationService } from "../room/room-database-synchronization-service";

@singleton()
export class DatabaseSynchronizationService {
  constructor(
    @inject(PlayerDatabaseSynchronizationService)
    private playerDatabaseSynchronizationService: PlayerDatabaseSynchronizationService,
    @inject(RoomDatabaseSynchronizationService)
    private roomDatabaseSynchronizationService: RoomDatabaseSynchronizationService,
    @inject(Logger)
    private logger: Logger,
  ) {}

  startSynchronizationLoop(): void {
    this.synchronize();
  }

  private synchronize(): void {
    setTimeout(() => {
      this.logger.info("Start synchronizing");
      Promise.all([
        this.playerDatabaseSynchronizationService.synchronize(),
        this.roomDatabaseSynchronizationService.synchronize(),
      ])
        .then(() => {
          this.logger.info("Synchronizeation ended");
        })
        .catch((error) => {
          this.logger.error(`Error while synchronizing: ${error}`);
        })
        .finally(() => {
          this.synchronize();
        });
    }, 10000);
  }
}
