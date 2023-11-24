import {
  Item,
  ItemCode,
  Slot,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { Show, createMemo, createSignal } from "solid-js";
import { storeService, t, wardrobeService } from "../app/services";
import Button from "../ui/button";
import ItemSelector from "./item-selector";
import WardrobeSlot from "./wardrobe-slot";

export default function WardrobeView() {
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
    () => storeService.getPlayer()?.character.wearables ?? {}
  );

  function wear(item: Item) {
    const slot = selectedSlot();
    if (!slot) {
      return;
    }
    wardrobeService
      .wear(slot, item.id)
      .then(() => setSelectedSlot(undefined))
      .catch(console.log);
  }

  return (
    <>
      <Show when={!selectedSlot()}>
        <div class="flex flex-col gap-2">
          <WardrobeSlot
            slot={Slot.LeftSleeve}
            item={wearables()[Slot.LeftSleeve]}
            onItemChange={() => setSelectedSlot(Slot.LeftSleeve)}
          ></WardrobeSlot>
          <WardrobeSlot
            slot={Slot.RightSleeve}
            item={wearables()[Slot.RightSleeve]}
            onItemChange={() => setSelectedSlot(Slot.RightSleeve)}
          ></WardrobeSlot>
        </div>
      </Show>
      <Show when={selectedSlot()}>
        {(slot) => (
          <div>
            <div class="mb-2">
              <WardrobeSlot
                slot={slot()}
                item={wearables()[slot()]}
              ></WardrobeSlot>
            </div>
            <div class="mb-4">
              <div class="text-sm font-bold mb-1">{t("common.chooseItem")}</div>
              <ItemSelector
                items={allowedItems()}
                onSelect={wear}
              ></ItemSelector>
            </div>
            <div>
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
