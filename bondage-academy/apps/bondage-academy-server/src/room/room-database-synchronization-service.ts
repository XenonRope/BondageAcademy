import { RoomService } from "./room-service";
import { RoomStoreService } from "./room-store-service";

export class RoomDatabaseSynchronizationService {
  constructor(
    private roomStoreService: RoomStoreService,
    private roomService: RoomService
  ) {}

  async synchronize(): Promise<void> {
    const rooms = this.roomStoreService.save();
    console.log("[Synchronization][Rooms] Count: " + rooms.length);
    if (rooms.length !== 0) {
      await this.roomService.updateRoomsInBulk(rooms);
    }
  }
}
