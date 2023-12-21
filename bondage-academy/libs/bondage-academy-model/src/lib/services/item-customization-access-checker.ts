import { EquippedItem } from "../model/character";

export class ItemCustomizationAccessChecker {
  canCustomizeItem(params: {
    actorPlayerId: number;
    targetPlayerId: number;
    equippedItem: EquippedItem;
  }): boolean {
    return (
      params.actorPlayerId === params.targetPlayerId ||
      params.equippedItem.ownerPlayerId === params.actorPlayerId
    );
  }
}
