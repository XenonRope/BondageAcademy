import {
  ItemCode,
  ItemCustomization,
  ItemCustomizationAccessChecker,
  Slot,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";

export class WardrobeCustomizationService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
    private itemCustomizationAccessChecker: ItemCustomizationAccessChecker
  ) {}

  async customizeItem(params: {
    actorPlayerId: number;
    targetPlayerId: number;
    slot: Slot;
    customizations?: ItemCustomization[];
  }): Promise<void> {
    const { equippedItem } = await this.assertCanCustomizeItem(params);
    equippedItem.customizations = params.customizations;
    await this.playerStoreService.update(params.targetPlayerId, (player) => {
      player.character.wearables[params.slot] = equippedItem;
    });
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      params.targetPlayerId,
      {
        wearables: [
          {
            slot: params.slot,
            equippedItem,
          },
        ],
      }
    );
  }

  private async assertCanCustomizeItem(params: {
    actorPlayerId: number;
    targetPlayerId: number;
    slot: Slot;
    customizations?: ItemCustomization[];
  }) {
    const actorPlayer = await this.playerStoreService.get(params.actorPlayerId);
    const targetPlayer = await this.playerStoreService.get(
      params.targetPlayerId
    );
    if (actorPlayer.roomId !== targetPlayer.roomId) {
      throw new Error("Players are not in the same room");
    }
    if (!actorPlayer.roomId && actorPlayer.id !== targetPlayer.id) {
      throw new Error(
        "Only player can change their own clothes if they are not in a room"
      );
    }
    const equippedItem = targetPlayer.character.wearables[params.slot];
    if (!equippedItem) {
      throw new Error("No item equipped in slot");
    }
    if (
      !this.itemCustomizationAccessChecker.canCustomizeItem({
        actorPlayerId: params.actorPlayerId,
        targetPlayerId: params.targetPlayerId,
        equippedItem,
      })
    ) {
      throw new Error("No access to customize item");
    }
    if (
      params.customizations &&
      this.isAnyCustomizationInvalid(
        equippedItem.item.code,
        params.customizations
      )
    ) {
      throw new Error("Customization is invalid");
    }

    return { equippedItem };
  }

  private isAnyCustomizationInvalid(
    itemCode: ItemCode,
    customizations: ItemCustomization[]
  ) {
    if (this.isAnyFragmentNameDuplicated(customizations)) {
      return true;
    }
    const item = itemConfigs[itemCode];
    for (const customization of customizations) {
      const fragments = item.fragments.filter(
        (fragment) => fragment.name === customization.fragmentName
      );
      if (fragments.length === 0) {
        return true;
      }
      for (const fragment of fragments) {
        if (
          customization.texture &&
          !fragment.textures?.find(
            (texture) => texture.code === customization.texture
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private isAnyFragmentNameDuplicated(
    customizations: ItemCustomization[]
  ): boolean {
    const fragmentNames = customizations.map(
      (customization) => customization.fragmentName
    );
    return fragmentNames.some(
      (fragmentName, index) => fragmentNames.indexOf(fragmentName) !== index
    );
  }
}
