import { SlotType, slotConfigs } from "../config/slot-config";
import { Actor, isPlayerActor } from "../model/actor";
import { EquippedItem } from "../model/character";
import { Slot } from "../model/slot";

export class ItemCustomizationAccessChecker {
  canCustomizeItem(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    equippedItem: EquippedItem;
  }): boolean {
    if (!isPlayerActor(params.actor)) {
      return false;
    }
    return (
      slotConfigs[params.slot].type === SlotType.Item &&
      ((isPlayerActor(params.target) &&
        params.actor.playerId === params.target.playerId) ||
        params.equippedItem.ownerPlayerId === params.actor.playerId)
    );
  }
}
