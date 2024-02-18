import {
  Actor,
  ItemCode,
  ItemCustomization,
  ItemCustomizationAccessChecker,
  Slot,
  isPlayerActor,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { ActorService } from "../actor/actor-service";

export class WardrobeCustomizationService {
  constructor(
    private itemCustomizationAccessChecker: ItemCustomizationAccessChecker,
    private actorService: ActorService,
  ) {}

  async customizeItem(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    customizations?: ItemCustomization[];
  }): Promise<void> {
    const { equippedItem } = await this.assertCanCustomizeItem(params);
    equippedItem.customizations = params.customizations;
    await this.actorService.updateActor(params.target, ({ character }) => {
      character.wearables[params.slot] = equippedItem;
    });
    await this.actorService.synchronizeActorWithClient(params.target, {
      wearables: [
        {
          slot: params.slot,
          equippedItem,
        },
      ],
    });
  }

  private async assertCanCustomizeItem(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    customizations?: ItemCustomization[];
  }) {
    const actor = await this.actorService.getActorData(params.actor);
    const target = await this.actorService.getActorData(params.target);
    if (actor.roomId !== target.roomId) {
      throw new Error("Actors are not in the same room");
    }
    if (
      !actor.roomId &&
      !(
        isPlayerActor(params.actor) &&
        isPlayerActor(params.target) &&
        params.actor.playerId === params.target.playerId
      )
    ) {
      throw new Error(
        "Only player can change their own clothes if they are not in a room",
      );
    }
    const equippedItem = target.character.wearables[params.slot];
    if (!equippedItem) {
      throw new Error("No item equipped in slot");
    }
    if (
      !this.itemCustomizationAccessChecker.canCustomizeItem({
        actor: params.actor,
        target: params.target,
        slot: params.slot,
        equippedItem,
      })
    ) {
      throw new Error("No access to customize item");
    }
    if (params.customizations) {
      this.assertCustomizationsAreValid(
        equippedItem.item.code,
        params.customizations,
      );
    }

    return { equippedItem };
  }

  private assertCustomizationsAreValid(
    itemCode: ItemCode,
    customizations: ItemCustomization[],
  ): void {
    this.assertFragmentNamesAreNotDuplicated(customizations);
    const item = itemConfigs[itemCode];
    for (const customization of customizations) {
      const fragments = item.fragments.filter(
        (fragment) => fragment.name === customization.fragmentName,
      );
      if (fragments.length === 0) {
        throw new Error(`No fragment with name ${customization.fragmentName}`);
      }
      for (const fragment of fragments) {
        if (
          customization.texture &&
          !fragment.textures?.find(
            (texture) => texture.name === customization.texture,
          )
        ) {
          throw new Error(
            `No texture with name ${customization.texture} in fragment ${fragment.name}`,
          );
        }
      }
    }
  }

  private assertFragmentNamesAreNotDuplicated(
    customizations: ItemCustomization[],
  ): void {
    const fragmentNames = customizations.map(
      (customization) => customization.fragmentName,
    );
    const duplicatedFragmentName = fragmentNames.find(
      (fragmentName, index) => fragmentNames.indexOf(fragmentName) !== index,
    );
    if (duplicatedFragmentName) {
      throw new Error(`Fragment ${duplicatedFragmentName} is duplicated`);
    }
  }
}
