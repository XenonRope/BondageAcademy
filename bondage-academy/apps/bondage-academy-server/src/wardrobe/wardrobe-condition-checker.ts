import {
  Actor,
  Character,
  Item,
  ItemCode,
  ItemReference,
  PhantomItem,
  Slot,
  SlotType,
  WardrobeValidator,
  isPhantomItem,
  isPlayerActor,
  itemConfigs,
  slotConfigs,
} from "@bondage-academy/bondage-academy-model";
import { ActorData } from "../actor/actor-data";
import { ActorService } from "../actor/actor-service";
import { PlayerStoreService } from "../player/player-store-service";

export class WardrobeConditionChecker {
  constructor(
    private playerStoreService: PlayerStoreService,
    private wardrobeValidator: WardrobeValidator,
    private actorService: ActorService,
  ) {}

  async assertCanWear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    item?: ItemReference | PhantomItem;
  }): Promise<{
    actor: ActorData;
    target: ActorData;
    item?: Item | PhantomItem;
  }> {
    const actor = await this.actorService.getActorData(params.actor);
    const target = await this.actorService.getActorData(params.target);

    if (
      target.character.wearables[params.slot] == null &&
      params.item == null
    ) {
      throw new Error(
        `Cannot remove item from slot ${params.slot} because slot is already empty`,
      );
    }

    if (slotConfigs[params.slot].type === SlotType.Body) {
      if (
        !isPlayerActor(params.actor) ||
        !isPlayerActor(params.target) ||
        params.actor.playerId !== params.target.playerId
      ) {
        throw new Error("Cannot change body part of another player or NPC");
      }
      if (params.item && !isPhantomItem(params.item)) {
        throw new Error("Expected phantom item");
      }
      if (params.item) {
        this.assertCanWearItemInSlot(params.item.code, params.slot);
      }

      return { actor, target, item: params.item };
    }

    if (actor.roomId !== target.roomId) {
      throw new Error("Actors are not in the same room");
    }
    if (
      !actor.roomId &&
      (!isPlayerActor(params.actor) ||
        !isPlayerActor(params.target) ||
        params.actor.playerId !== params.target.playerId)
    ) {
      throw new Error(
        "Only player can change their own clothes if they are not in a room",
      );
    }
    const item = params.item
      ? await this.findItem(params.actor, params.item)
      : undefined;
    if (item) {
      this.assertCanWearItemInSlot(item.code, params.slot);
      if (this.isSlotBlocked(target.character, params.slot)) {
        throw new Error(`Cannot wear ${item?.code} because slot is blocked`);
      }
      if (this.isAnyBlockedSlotOccupied(target.character, item.code)) {
        throw new Error(
          `Cannot wear ${item?.code} because blocked slot is occupied`,
        );
      }
    }

    return { actor, target, item };
  }

  private isSlotBlocked(character: Character, slot: Slot): boolean {
    return this.wardrobeValidator.isSlotBlocked(character, slot);
  }

  private isAnyBlockedSlotOccupied(
    character: Character,
    itemCode: ItemCode,
  ): boolean {
    const blockedSlots = itemConfigs[itemCode].blockedSlots;
    return blockedSlots
      ? this.wardrobeValidator.isAnySlotOccupied(character, blockedSlots)
      : false;
  }

  private async findItem(
    actor: Actor,
    itemReference: ItemReference | PhantomItem,
  ): Promise<Item | PhantomItem> {
    if (isPlayerActor(actor)) {
      if (isPhantomItem(itemReference)) {
        throw new Error("Using phantom item by player is not supported");
      }
      const player = await this.playerStoreService.get(actor.playerId);
      const playerItem = player.items.find(
        (item) => item.id === itemReference.id,
      );
      if (!playerItem) {
        throw new Error("Item not found");
      }
      return playerItem;
    }
    if (isPhantomItem(itemReference)) {
      return itemReference;
    }
    throw new Error("Expected phantom item if actor is NPC");
  }

  private assertCanWearItemInSlot(itemCode: ItemCode, slot: Slot) {
    if (!itemConfigs[itemCode].allowedSlots.includes(slot)) {
      throw new Error(`Item ${itemCode} not allowed in slot ${slot}`);
    }
  }
}
