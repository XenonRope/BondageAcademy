import {
  playerSynchronizationService,
  type PlayerSynchronizationService,
} from "./PlayerSynchronizationService";

export class SynchronizationService {
  constructor(
    private playerSynchronizationService: PlayerSynchronizationService
  ) {}

  startSynchronizationLoop(): void {
    this.synchronize();
  }

  private synchronize(): void {
    setTimeout(() => {
      console.log("Start synchronizing");
      this.playerSynchronizationService
        .synchronize()
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

export const synchronizationService = new SynchronizationService(
  playerSynchronizationService
);
