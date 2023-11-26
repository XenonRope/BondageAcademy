import {
  Actor,
  EquippedItem,
  Slot,
} from "@bondage-academy/bondage-academy-model";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";

export class WardrobeService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
    private wardrobeConditionChecker: WardrobeConditionChecker
  ) {}

  async wear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    itemId?: number;
  }): Promise<void> {
    const { actorPlayer, targetPlayer, item } =
      await this.wardrobeConditionChecker.assertCanWear(params);
    const oldItem: EquippedItem | undefined =
      targetPlayer.character.wearables[params.slot];
    const oldItemShouldGoToTarget =
      oldItem && oldItem.ownerPlayerId === targetPlayer.id;
    await this.playerStoreService.update(actorPlayer.id, (player) => {
      if (oldItem && !oldItemShouldGoToTarget) {
        player.items.push(oldItem.item);
      }
      if (params.itemId) {
        player.items = player.items.filter((item) => item.id !== params.itemId);
      }
    });
    await this.playerStoreService.update(targetPlayer.id, (player) => {
      if (oldItemShouldGoToTarget) {
        player.items.push(oldItem.item);
      }
      player.character.wearables[params.slot] = item
        ? {
            item,
            ownerPlayerId: actorPlayer.id,
          }
        : undefined;
    });
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      actorPlayer.id,
      {
        items: {
          add: oldItem && !oldItemShouldGoToTarget ? [oldItem.item] : [],
          remove: params.itemId ? [params.itemId] : [],
        },
      }
    );
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      targetPlayer.id,
      {
        items: {
          add: oldItemShouldGoToTarget ? [oldItem.item] : [],
        },
        wearables: [
          {
            slot: params.slot,
            equippedItem: item
              ? { item, ownerPlayerId: actorPlayer.id }
              : undefined,
          },
        ],
      }
    );
  }
}
