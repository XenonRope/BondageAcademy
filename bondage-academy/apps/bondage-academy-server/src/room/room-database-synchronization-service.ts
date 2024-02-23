import { inject, singleton } from "tsyringe";
import { RoomService } from "./room-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomDatabaseSynchronizationService {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(RoomService)
    private roomService: RoomService,
  ) {}

  async synchronize(): Promise<void> {
    const rooms = this.roomStoreService.save();
    console.log("[Synchronization][Rooms] Count: " + rooms.length);
    if (rooms.length !== 0) {
      await this.roomService.updateRoomsInBulk(rooms);
    }
  }
}
