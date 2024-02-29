import {
  Actor,
  EquippedItem,
  Slot,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { NPCStoreService } from "../npc/npc-store-service";
import { PlayerStoreService } from "../player/player-store-service";

@singleton()
export class ActorStoreService {
  constructor(
    @inject(PlayerStoreService) private playerStoreService: PlayerStoreService,
    @inject(NPCStoreService) private npcStoreService: NPCStoreService,
  ) {}

  async getRoomId(actor: Actor): Promise<number | undefined> {
    if (isPlayerActor(actor)) {
      return await this.playerStoreService.getPlayerRoomId(actor.playerId);
    }
    return actor.roomId;
  }

  async getEquippedItem(
    actor: Actor,
    slot: Slot,
  ): Promise<EquippedItem | undefined> {
    if (isPlayerActor(actor)) {
      return await this.playerStoreService.getEquippedItem(
        actor.playerId,
        slot,
      );
    }
    return await this.npcStoreService.getEquippedItem(
      actor.objectId,
      actor.roomId,
      slot,
    );
  }
}
