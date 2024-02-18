import { itemConfigs } from "../config/item-config";
import { Character } from "../model/character";
import { Slot } from "../model/slot";

export class WardrobeValidator {
  isAnySlotOccupied(character: Character, slots: Slot[]): boolean {
    const occupiedSlots = this.getOccupiedSlots(character);
    return slots.some((slot) => occupiedSlots.includes(slot));
  }

  getOccupiedSlots(character: Character): Slot[] {
    return Object.entries(character.wearables).flatMap(([slot, wearable]) =>
      wearable != null ? [slot as Slot] : [],
    );
  }

  isSlotBlocked(character: Character, slot: Slot): boolean {
    return this.getBlockedSlots(character).includes(slot);
  }

  getBlockedSlots(character: Character): Slot[] {
    return Object.values(character.wearables)
      .filter((wearable) => wearable != null)
      .flatMap(
        (wearable) => itemConfigs[wearable.item.code].blockedSlots ?? [],
      );
  }
}
