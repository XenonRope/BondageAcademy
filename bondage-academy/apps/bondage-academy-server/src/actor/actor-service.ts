import {
  Actor,
  ActorType,
  CharacterPose,
  EquippedItem,
  Item,
  PlayerActor,
  RoomUtils,
  Slot,
  UpdateActor,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { RoomStoreService } from "../room/room-store-service";
import { ActorData } from "./actor-data";

@singleton()
export class ActorService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(PlayerClientSynchronizationService)
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
    @inject(ObjectClientSynchronizationService)
    private objectClientSynchronizationService: ObjectClientSynchronizationService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
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

  async updatePose(actor: Actor, pose: CharacterPose): Promise<void> {
    if (isPlayerActor(actor)) {
      await this.playerStoreService.updatePose(actor.playerId, pose);
      return;
    }
    await this.roomStoreService.updateNpcPose(
      actor.roomId,
      actor.objectId,
      pose,
    );
  }

  async updateEquippedItem(
    actor: Actor,
    slot: Slot,
    item?: EquippedItem,
  ): Promise<void> {
    if (isPlayerActor(actor)) {
      await this.playerStoreService.updateEquippedItem(
        actor.playerId,
        slot,
        item,
      );
      return;
    }
    await this.roomStoreService.updateNpcEquippedItem(
      actor.roomId,
      actor.objectId,
      slot,
      item,
    );
  }

  async addItems(actor: Actor, items: Item[]): Promise<void> {
    if (isPlayerActor(actor)) {
      await this.playerStoreService.addItems(actor.playerId, items);
      return;
    }
    await this.roomStoreService.addItemsToNpc(
      actor.roomId,
      actor.objectId,
      items,
    );
  }

  async synchronizeActorWithClient(
    actor: Actor,
    updateActor: UpdateActor,
  ): Promise<void> {
    if (isPlayerActor(actor)) {
      await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
        actor.playerId,
        updateActor,
      );
      return;
    }
    const sessions = await this.roomSessionService.getSessionsInRoom(
      actor.roomId,
    );
    this.objectClientSynchronizationService.synchronizeObjects(
      {
        updateNPCs: [{ ...updateActor, id: actor.objectId }],
      },
      sessions,
    );
  }
}
