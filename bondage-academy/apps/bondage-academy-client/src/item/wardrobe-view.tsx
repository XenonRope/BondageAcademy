import {
  Actor,
  ArrayUtils,
  Item,
  ItemCode,
  ItemCustomization,
  PartialRecord,
  Slot,
  itemConfigs,
  prepareActorByPlayerId,
} from "@bondage-academy/bondage-academy-model";
import { For, Show, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
  itemCustomizationAccessChecker,
  store,
  storeService,
  t,
  wardrobeService,
} from "../app/services";
import CharacterView from "../character/character-view";
import Button from "../ui/button";
import ItemSelector from "./item-selector";
import WardrobeCustomizations from "./wardrobe-customizations";
import WardrobeSlot from "./wardrobe-slot";

export default function WardrobeView(props: { actor: Actor }) {
  const [selectedSlot, setSelectedSlot] = createSignal<Slot>();
  const [customizations, setCustomizations] = createStore<ItemCustomization[]>(
    []
  );

  const allowedItems = createMemo<Item[]>(() => {
    const slot = selectedSlot();
    if (!slot) {
      return [];
    }
    const allowedItemCodes: ItemCode[] = Object.values(itemConfigs).flatMap(
      (config) => (config.allowedSlots.includes(slot) ? [config.code] : [])
    );
    return (
      storeService
        .getPlayer()
        ?.items.filter((item) => allowedItemCodes.includes(item.code)) ?? []
    );
  });

  const character = createMemo(() =>
    storeService.getCharacterByActor(props.actor)
  );

  const wearables = createMemo(() => character()?.wearables ?? {});

  const getEquippedItem = createMemo(() => {
    const slot = selectedSlot();
    return slot && wearables()[slot];
  });

  const canCustomize = createMemo(() => {
    const slot = selectedSlot();
    const equippedItem = getEquippedItem();
    return (
      slot &&
      store.playerId &&
      equippedItem &&
      itemCustomizationAccessChecker.canCustomizeItem({
        actor: prepareActorByPlayerId(store.playerId),
        target: props.actor,
        slot,
        equippedItem,
      })
    );
  });

  const slots: Slot[] = [
    Slot.Mouth,
    Slot.Nipples,
    Slot.UpperUndies,
    Slot.UpperOutfit,
    Slot.LeftSleeve,
    Slot.RightSleeve,
    Slot.BodyAccessory,
    Slot.Body,
    Slot.LowerUndies,
    Slot.Shoes,
  ];

  function wear(item?: Item) {
    const slot = selectedSlot();
    if (!slot) {
      return;
    }
    wardrobeService
      .wear(props.actor, slot, item ? { id: item.id } : undefined)
      .then(() => selectSlot(undefined))
      .catch(console.log);
  }

  function selectSlot(slot?: Slot): void {
    setSelectedSlot(slot);
    setCustomizations(prepareCustomizations(slot));
  }

  function prepareCustomizations(slot?: Slot): ItemCustomization[] {
    if (!slot) {
      return [];
    }
    const equippedItem = wearables()[slot];
    if (!equippedItem) {
      return [];
    }
    const currentCustomizations = equippedItem.customizations;
    const itemCode = equippedItem.item?.code;
    if (!itemCode) {
      return [];
    }
    const itemConfig = itemConfigs[itemCode];

    return ArrayUtils.distinct(
      itemConfig.fragments.map((fragment) => fragment.name)
    ).map((fragmentName) => {
      const currentCustomization = currentCustomizations?.find(
        (customization) => customization.fragmentName === fragmentName
      );
      return {
        fragmentName,
        color: currentCustomization?.color,
        texture: currentCustomization?.texture,
      };
    });
  }

  function getCustomizationsBySlot():
    | PartialRecord<Slot, ItemCustomization[]>
    | undefined {
    const slot = selectedSlot();
    return slot && { [slot]: customizations };
  }

  function saveCustomizations() {
    const slot = selectedSlot();
    if (slot) {
      wardrobeService
        .customizeItem(props.actor, slot, customizations)
        .catch(console.log);
    }
  }

  return (
    <div class="flex">
      <div class="w-60 shrink-0">
        <Show when={!selectedSlot()}>
          <div class="flex flex-col gap-2">
            <For each={slots}>
              {(slot) => (
                <WardrobeSlot
                  slot={slot}
                  itemCode={wearables()[slot]?.item.code}
                  onItemChange={() => selectSlot(slot)}
                ></WardrobeSlot>
              )}
            </For>
          </div>
        </Show>
        <Show when={selectedSlot()}>
          {(slot) => (
            <div>
              <div class="mb-2">
                <WardrobeSlot
                  slot={slot()}
                  itemCode={wearables()[slot()]?.item.code}
                ></WardrobeSlot>
              </div>
              <Show when={getEquippedItem()}>
                {(equippedItem) => (
                  <div class="mb-4">
                    <div class="text-sm font-bold mb-1">
                      {t("common.customize")}
                    </div>
                    <Show when={canCustomize()}>
                      <WardrobeCustomizations
                        customizations={customizations}
                        setCustomizations={setCustomizations}
                        itemCode={equippedItem().item.code}
                        onCustomizationsChange={saveCustomizations}
                      />
                    </Show>
                    <Show when={!canCustomize()}>
                      <div class="text-sm font-medium">
                        {t("common.noAccess")}
                      </div>
                    </Show>
                  </div>
                )}
              </Show>
              <div class="mb-4">
                <div class="text-sm font-bold mb-1">
                  {t("common.chooseItem")}
                </div>
                <ItemSelector
                  items={allowedItems()}
                  onSelect={wear}
                ></ItemSelector>
              </div>
              <div class="flex gap-2">
                <Show when={wearables()[slot()]}>
                  <Button onClick={() => wear(undefined)}>
                    {t("common.removeCloth")}
                  </Button>
                </Show>
                <Button onClick={() => selectSlot(undefined)}>
                  {t("common.back")}
                </Button>
              </div>
            </div>
          )}
        </Show>
      </div>
      <div class="shrink overflow-hidden">
        <Show when={character()}>
          {(character) => (
            <CharacterView
              character={character()}
              customizations={getCustomizationsBySlot()}
            />
          )}
        </Show>
      </div>
    </div>
  );
}
