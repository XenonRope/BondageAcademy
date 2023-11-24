import {
  Item,
  Slot,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";

export class WardrobeService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService
  ) {}

  async wear(playerId: number, slot: Slot, itemId?: number): Promise<void> {
    const player = await this.playerStoreService.get(playerId);
    const newItem = itemId
      ? player.items.find((item) => item.id === itemId)
      : undefined;
    if (itemId && !newItem) {
      throw new Error("Item not found");
    }
    if (newItem && !itemConfigs[newItem.code].allowedSlots.includes(slot)) {
      throw new Error(`Item ${newItem.code} not allowed in slot ${slot}`);
    }
    const oldItem: Item | undefined = player.character.wearables[slot];
    await this.playerStoreService.update(playerId, (player) => {
      if (itemId) {
        player.items = player.items.filter((item) => item.id !== itemId);
      }
      if (oldItem) {
        player.items.push(oldItem);
      }
      player.character.wearables[slot] = newItem;
    });
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      playerId,
      {
        items: {
          add: oldItem ? [oldItem] : [],
          remove: itemId ? [itemId] : [],
        },
        wearables: {
          [slot]: {
            item: newItem,
          },
        },
      }
    );
  }
}
