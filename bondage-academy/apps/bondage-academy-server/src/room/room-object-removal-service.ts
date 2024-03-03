import { Room } from "@bondage-academy/bondage-academy-model";
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

  async removeObject(room: Room, objectId: number): Promise<void> {
    await this.roomStoreService.removeObjectById(room.id, objectId);
    const sessions = this.roomSessionService.getSessionsInRoom(room);
    this.objectClientSynchronizationService.synchronizeObjects(
      {
        toRemove: [objectId],
      },
      sessions,
    );
  }
}
