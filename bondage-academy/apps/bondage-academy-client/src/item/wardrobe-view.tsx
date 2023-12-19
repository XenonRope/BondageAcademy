import {
  ArrayUtils,
  Item,
  ItemCode,
  ItemCustomization,
  Slot,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { For, Show, createMemo, createSignal } from "solid-js";
import { storeService, t, wardrobeService } from "../app/services";
import CharacterView from "../character/character-view";
import Button from "../ui/button";
import ColorPicker from "../ui/color-picker";
import ItemSelector from "./item-selector";
import WardrobeSlot from "./wardrobe-slot";

export default function WardrobeView(props: { playerId: number }) {
  const [selectedSlot, setSelectedSlot] = createSignal<Slot>();
  const [customizations, setCustomizations] = createSignal<ItemCustomization[]>(
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

  const character = createMemo(
    () => storeService.getPlayerById(props.playerId)?.character
  );

  const wearables = createMemo(() => character()?.wearables ?? {});

  const displayedCharacter = createMemo(() => {
    const slot = selectedSlot();
    if (!slot) {
      return character();
    }
    const originalCharacter = character();
    return originalCharacter
      ? {
          ...originalCharacter,
          wearables: {
            ...originalCharacter.wearables,
            [slot]: {
              ...originalCharacter.wearables[slot],
              customizations: customizations(),
            },
          },
        }
      : undefined;
  });

  const slots: Slot[] = [
    Slot.Hair,
    Slot.UpperUndies,
    Slot.LeftSleeve,
    Slot.RightSleeve,
    Slot.LowerUndies,
    Slot.Shoes,
  ];

  function wear(item?: Item) {
    const slot = selectedSlot();
    if (!slot) {
      return;
    }
    wardrobeService
      .wear(props.playerId, slot, item?.id)
      .then(() => selectSlot(undefined))
      .catch(console.log);
  }

  function selectSlot(slot?: Slot): void {
    setSelectedSlot(slot);
    setCustomizations(prepareDefaultCustomizations(slot));
  }

  function prepareDefaultCustomizations(slot?: Slot): ItemCustomization[] {
    if (!slot) {
      return [];
    }
    const itemCode = wearables()[slot]?.item?.code;
    if (!itemCode) {
      return [];
    }
    const itemConfig = itemConfigs[itemCode];

    return ArrayUtils.distinct(
      itemConfig.fragments.map((fragment) => fragment.name)
    ).map((fragmentName) => ({
      fragmentName,
      color: undefined,
      texture: undefined,
    }));
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
                  item={wearables()[slot]?.item}
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
                  item={wearables()[slot()]?.item}
                ></WardrobeSlot>
              </div>
              <div class="mb-4">
                <div class="text-sm font-bold mb-1">
                  {t("common.customize")}
                </div>
                <For each={customizations()}>
                  {(customization, index) => (
                    <ColorPicker
                      color={customization.color}
                      onInput={(color) =>
                        setCustomizations((customizations) => [
                          ...customizations.slice(0, index()),
                          { ...customizations[index()], color },
                          ...customizations.slice(index() + 1),
                        ])
                      }
                    />
                  )}
                </For>
              </div>
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
        <Show when={displayedCharacter()}>
          {(displayedCharacter) => (
            <CharacterView character={displayedCharacter()} />
          )}
        </Show>
      </div>
    </div>
  );
}
