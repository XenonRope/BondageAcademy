import {
  GameObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "./room-session-service";
import { RoomStoreService } from "./room-store-service";

export class RoomObjectCreationService {
  constructor(
    private roomStoreService: RoomStoreService,
    private roomSessionService: RoomSessionService,
    private objectClientSynchronizationService: ObjectClientSynchronizationService,
    private playerStoreService: PlayerStoreService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
  ) {}

  async createObject(roomId: number, object: GameObject): Promise<void> {
    await this.roomStoreService.update(roomId, (room) =>
      room.objects.push(object),
    );
    const sessions = await this.roomSessionService.getSessionsInRoom(roomId);
    this.objectClientSynchronizationService.synchronizeObjects(
      { objects: [object] },
      sessions,
    );
    if (isPlayerObject(object)) {
      const player = await this.playerStoreService.get(object.playerId);
      this.playerClientSynchronizationService.synchronizePlayers(sessions, {
        replacePlayers: [player],
      });
    }
  }
}
