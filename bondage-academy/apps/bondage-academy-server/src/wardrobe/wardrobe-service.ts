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

  async wear(
    actorPlayerId: number,
    targetPlayerId: number,
    slot: Slot,
    itemId?: number
  ): Promise<void> {
    const actorPlayer = await this.playerStoreService.get(actorPlayerId);
    const targetPlayer = await this.playerStoreService.get(targetPlayerId);
    if (actorPlayer.roomId !== targetPlayer.roomId) {
      throw new Error("Players are not in the same room");
    }
    const newItem = itemId
      ? actorPlayer.items.find((item) => item.id === itemId)
      : undefined;
    if (itemId && !newItem) {
      throw new Error("Item not found");
    }
    if (newItem && !itemConfigs[newItem.code].allowedSlots.includes(slot)) {
      throw new Error(`Item ${newItem.code} not allowed in slot ${slot}`);
    }
    const oldItem: Item | undefined = targetPlayer.character.wearables[slot];
    await this.playerStoreService.update(actorPlayerId, (player) => {
      if (itemId) {
        player.items = player.items.filter((item) => item.id !== itemId);
      }
    });
    await this.playerStoreService.update(targetPlayerId, (player) => {
      if (oldItem) {
        player.items.push(oldItem);
      }
      player.character.wearables[slot] = newItem;
    });
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      actorPlayerId,
      {
        items: {
          remove: itemId ? [itemId] : [],
        },
      }
    );
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      targetPlayerId,
      {
        items: {
          add: oldItem ? [oldItem] : [],
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
