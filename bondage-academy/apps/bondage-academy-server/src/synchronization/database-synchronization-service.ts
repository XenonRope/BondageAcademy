import { inject, singleton } from "tsyringe";
import { PlayerDatabaseSynchronizationService } from "../player/player-database-synchronization-service";
import { RoomDatabaseSynchronizationService } from "../room/room-database-synchronization-service";

@singleton()
export class DatabaseSynchronizationService {
  constructor(
    @inject(PlayerDatabaseSynchronizationService)
    private playerDatabaseSynchronizationService: PlayerDatabaseSynchronizationService,
    @inject(RoomDatabaseSynchronizationService)
    private roomDatabaseSynchronizationService: RoomDatabaseSynchronizationService,
  ) {}

  startSynchronizationLoop(): void {
    this.synchronize();
  }

  private synchronize(): void {
    setTimeout(() => {
      console.log("Start synchronizing");
      Promise.all([
        this.playerDatabaseSynchronizationService.synchronize(),
        this.roomDatabaseSynchronizationService.synchronize(),
      ])
        .then(() => {
          console.log("Synchronizeation ended");
        })
        .catch((error) => {
          console.log(`Error while synchronizing: ${error}`);
        })
        .finally(() => {
          this.synchronize();
        });
    }, 10000);
  }
}
