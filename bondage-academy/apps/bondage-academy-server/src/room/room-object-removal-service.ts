import { inject, singleton } from "tsyringe";
import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { RoomSessionService } from "./room-session-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomObjectRemovalService {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(ObjectClientSynchronizationService)
    private objectClientSynchronizationService: ObjectClientSynchronizationService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
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
      sessions,
    );
  }
}
