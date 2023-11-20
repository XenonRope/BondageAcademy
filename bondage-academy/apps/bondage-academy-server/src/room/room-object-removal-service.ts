import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { RoomSessionService } from "./room-session-service";
import { RoomStoreService } from "./room-store-service";

export class RoomObjectRemovalService {
  constructor(
    private roomStoreService: RoomStoreService,
    private objectClientSynchronizationService: ObjectClientSynchronizationService,
    private roomSessionService: RoomSessionService
  ) {}

  async removeObject(roomId: number, objectId: number): Promise<void> {
    await this.roomStoreService.update(roomId, (room) => {
      room.objects = room.objects.filter((object) => object.id !== objectId);
    });
    const sessions = await this.roomSessionService.getSessionsInRoom(roomId);
    this.objectClientSynchronizationService.synchronizeObjects(
      {
        toRemove: [objectId],
      },
      sessions
    );
  }
}
