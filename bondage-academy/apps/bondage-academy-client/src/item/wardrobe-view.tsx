import {
  Color,
  Item,
  ItemCode,
  Slot,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { For, Show, createMemo, createSignal } from "solid-js";
import { storeService, t, wardrobeService } from "../app/services";
import Button from "../ui/button";
import ColorPicker from "../ui/color-picker";
import ItemSelector from "./item-selector";
import WardrobeSlot from "./wardrobe-slot";

export default function WardrobeView(props: { playerId: number }) {
  const [selectedSlot, setSelectedSlot] = createSignal<Slot | undefined>(
    undefined
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

  const wearables = createMemo(
    () => storeService.getPlayerById(props.playerId)?.character.wearables ?? {}
  );

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
      .then(() => setSelectedSlot(undefined))
      .catch(console.log);
  }

  function onColorChange(color?: Color) {
    console.log(color);
  }

  return (
    <>
      <Show when={!selectedSlot()}>
        <div class="flex flex-col gap-2">
          <For each={slots}>
            {(slot) => (
              <WardrobeSlot
                slot={slot}
                item={wearables()[slot]?.item}
                onItemChange={() => setSelectedSlot(slot)}
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
              <div class="text-sm font-bold mb-1">{t("common.customize")}</div>
              <ColorPicker onInput={onColorChange} />
            </div>
            <div class="mb-4">
              <div class="text-sm font-bold mb-1">{t("common.chooseItem")}</div>
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
              <Button onClick={() => setSelectedSlot(undefined)}>
                {t("common.back")}
              </Button>
            </div>
          </div>
        )}
      </Show>
    </>
  );
}
