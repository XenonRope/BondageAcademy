import {
  GameObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "./room-session-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomObjectCreationService {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(ObjectClientSynchronizationService)
    private objectClientSynchronizationService: ObjectClientSynchronizationService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(PlayerClientSynchronizationService)
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
  ) {}

  async createObject(roomId: number, object: GameObject): Promise<void> {
    await this.roomStoreService.addObject(roomId, object);
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
