import {
  EquippedItem,
  Item,
  Player,
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
    this.assertPlayersAreInTheSameRoom(actorPlayer, targetPlayer);
    const newItem = itemId ? this.findItem(actorPlayer, itemId) : undefined;
    if (newItem) {
      this.assertCanWearItemInSlot(newItem, slot);
    }
    const oldItem: EquippedItem | undefined =
      targetPlayer.character.wearables[slot];
    const oldItemShouldGoToTargetPlayer =
      oldItem && oldItem.ownerPlayerId === targetPlayerId;
    await this.playerStoreService.update(actorPlayerId, (player) => {
      if (oldItem && !oldItemShouldGoToTargetPlayer) {
        player.items.push(oldItem.item);
      }
      if (itemId) {
        player.items = player.items.filter((item) => item.id !== itemId);
      }
    });
    await this.playerStoreService.update(targetPlayerId, (player) => {
      if (oldItemShouldGoToTargetPlayer) {
        player.items.push(oldItem.item);
      }
      player.character.wearables[slot] = newItem
        ? {
            item: newItem,
            ownerPlayerId: actorPlayerId,
          }
        : undefined;
    });
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      actorPlayerId,
      {
        items: {
          add: oldItem && !oldItemShouldGoToTargetPlayer ? [oldItem.item] : [],
          remove: itemId ? [itemId] : [],
        },
      }
    );
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      targetPlayerId,
      {
        items: {
          add: oldItemShouldGoToTargetPlayer ? [oldItem.item] : [],
        },
        wearables: [
          {
            slot,
            equippedItem: newItem
              ? { item: newItem, ownerPlayerId: actorPlayerId }
              : undefined,
          },
        ],
      }
    );
  }

  private assertPlayersAreInTheSameRoom(
    actorPlayer: Player,
    targetPlayer: Player
  ) {
    if (actorPlayer.roomId !== targetPlayer.roomId) {
      throw new Error("Players are not in the same room");
    }
  }

  private findItem(actorPlayer: Player, itemId: number): Item {
    const item = actorPlayer.items.find((item) => item.id === itemId);
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
