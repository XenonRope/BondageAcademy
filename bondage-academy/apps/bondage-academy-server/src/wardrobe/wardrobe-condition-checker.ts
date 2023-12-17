import {
  Actor,
  Item,
  Player,
  Slot,
  isPlayerActor,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";

export class WardrobeConditionChecker {
  constructor(private playerStoreService: PlayerStoreService) {}

  async assertCanWear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    itemId?: number;
  }): Promise<{
    actorPlayer: Player;
    targetPlayer: Player;
    item?: Item;
  }> {
    if (!isPlayerActor(params.actor)) {
      throw new Error("Actor is not player");
    }
    if (!isPlayerActor(params.target)) {
      throw new Error("Target is not player");
    }
    const actorPlayer = await this.playerStoreService.get(
      params.actor.playerId
    );
    const targetPlayer = await this.playerStoreService.get(
      params.target.playerId
    );
    if (actorPlayer.roomId !== targetPlayer.roomId) {
      throw new Error("Players are not in the same room");
    }
    if (!actorPlayer.roomId && actorPlayer.id !== targetPlayer.id) {
      throw new Error(
        "Only player can change their own clothes if they are not in a room"
      );
    }
    const item = params.itemId
      ? this.findItem(actorPlayer, params.itemId)
      : undefined;
    if (item) {
      this.assertCanWearItemInSlot(item, params.slot);
    }

    return { actorPlayer, targetPlayer, item };
  }

  private findItem(player: Player, itemId: number): Item {
    const item = player.items.find((item) => item.id === itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }

  private assertCanWearItemInSlot(item: Item, slot: Slot) {
    if (!itemConfigs[item.code].allowedSlots.includes(slot)) {
      throw new Error(`Item ${item.code} not allowed in slot ${slot}`);
    }
  }
}
