import {
  Actor,
  Item,
  ItemCode,
  ItemReference,
  PhantomItem,
  Player,
  Slot,
  SlotType,
  isPhantomItem,
  isPlayerActor,
  itemConfigs,
  slotConfigs,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";

export class WardrobeConditionChecker {
  constructor(private playerStoreService: PlayerStoreService) {}

  async assertCanWear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    item?: ItemReference | PhantomItem;
  }): Promise<{
    actorPlayer: Player;
    targetPlayer: Player;
    item?: Item | PhantomItem;
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

    if (slotConfigs[params.slot].type === SlotType.Body) {
      if (params.actor.playerId !== params.target.playerId) {
        throw new Error("Cannot change body part of another player");
      }
      if (params.item && !isPhantomItem(params.item)) {
        throw new Error("Expected phantom item");
      }
      if (params.item) {
        this.assertCanWearItemInSlot(params.item.code, params.slot);
      }

      return { actorPlayer, targetPlayer, item: params.item };
    }

    if (actorPlayer.roomId !== targetPlayer.roomId) {
      throw new Error("Players are not in the same room");
    }
    if (!actorPlayer.roomId && actorPlayer.id !== targetPlayer.id) {
      throw new Error(
        "Only player can change their own clothes if they are not in a room"
      );
    }
    if (params.item && isPhantomItem(params.item)) {
      throw new Error("Not expected phantom item");
    }
    const item = params.item
      ? this.findItem(actorPlayer, params.item.id)
      : undefined;
    if (item) {
      this.assertCanWearItemInSlot(item.code, params.slot);
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

  private assertCanWearItemInSlot(itemCode: ItemCode, slot: Slot) {
    if (!itemConfigs[itemCode].allowedSlots.includes(slot)) {
      throw new Error(`Item ${itemCode} not allowed in slot ${slot}`);
    }
  }
}
