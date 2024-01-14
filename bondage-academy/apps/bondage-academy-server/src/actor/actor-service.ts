import {
  Actor,
  ActorType,
  Character,
  Item,
  PlayerActor,
  RoomUtils,
  UpdateActor,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { RoomStoreService } from "../room/room-store-service";
import { ActorData } from "./actor-data";

export class ActorService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private roomStoreService: RoomStoreService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
    private objectClientSynchronizationService: ObjectClientSynchronizationService,
    private roomSessionService: RoomSessionService
  ) {}

  async getActorDataByPlayerId(playerId: number): Promise<ActorData> {
    const actor: PlayerActor = { type: ActorType.Player, playerId };
    return await this.getActorData(actor);
  }

  async getActorData(actor: Actor): Promise<ActorData> {
    if (isPlayerActor(actor)) {
      const player = await this.playerStoreService.get(actor.playerId);
      return {
        actor,
        character: player.character,
        roomId: player.roomId,
        playerId: actor.playerId,
      };
    }
    const room = await this.roomStoreService.get(actor.roomId);
    const npcObject = RoomUtils.getNPCObject(room, actor.objectId);
    return {
      actor,
      character: npcObject.character,
      roomId: actor.roomId,
    };
  }

  async updateActor(
    actor: Actor,
    updateFn: (value: { character: Character; items: Item[] }) => void
  ): Promise<void> {
    if (isPlayerActor(actor)) {
      await this.playerStoreService.update(actor.playerId, (player) => {
        updateFn({ character: player.character, items: player.items });
      });
      return;
    }
    await this.roomStoreService.update(actor.roomId, (room) => {
      const npcObject = RoomUtils.getNPCObject(room, actor.objectId);
      updateFn({ character: npcObject.character, items: npcObject.items });
    });
  }

  async synchronizeActorWithClient(
    actor: Actor,
    updateActor: UpdateActor
  ): Promise<void> {
    if (isPlayerActor(actor)) {
      await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
        actor.playerId,
        updateActor
      );
      return;
    }
    const sessions = await this.roomSessionService.getSessionsInRoom(
      actor.roomId
    );
    this.objectClientSynchronizationService.synchronizeObjects(
      {
        updateNPCs: [{ ...updateActor, id: actor.objectId }],
      },
      sessions
    );
  }
}
