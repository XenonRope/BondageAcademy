import { SlotType, slotConfigs } from "../config/slot-config";
import { EquippedItem } from "../model/character";
import { Slot } from "../model/slot";

export class ItemCustomizationAccessChecker {
  canCustomizeItem(params: {
    actorPlayerId: number;
    targetPlayerId: number;
    slot: Slot;
    equippedItem: EquippedItem;
  }): boolean {
    return (
      slotConfigs[params.slot].type === SlotType.Item &&
      (params.actorPlayerId === params.targetPlayerId ||
        params.equippedItem.ownerPlayerId === params.actorPlayerId)
    );
  }
}
