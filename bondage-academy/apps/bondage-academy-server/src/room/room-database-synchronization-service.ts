import { inject, singleton } from "tsyringe";
import { Logger } from "../log/logger";
import { RoomService } from "./room-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomDatabaseSynchronizationService {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(RoomService)
    private roomService: RoomService,
    @inject(Logger)
    private logger: Logger,
  ) {}

  async synchronize(): Promise<void> {
    const rooms = this.roomStoreService.save();
    this.logger.info("[Synchronization][Rooms] Count: " + rooms.length);
    if (rooms.length !== 0) {
      await this.roomService.updateRoomsInBulk(rooms);
    }
  }
}
