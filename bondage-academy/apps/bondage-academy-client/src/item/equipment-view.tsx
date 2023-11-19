import { Item } from "@bondage-academy/bondage-academy-model";
import { For } from "solid-js";
import { storeService } from "../app/services";
import { itemPreviewService } from "./services/item-preview-service";

export default function EquipmentView() {
  function getItems(): Item[] {
    return storeService.getPlayer()?.items ?? [];
  }

  return (
    <div>
      <For each={getItems()}>
        {(item) => (
          <div
            class="h-[96px] w-[96px]"
            style={{
              "background-image": `url(${itemPreviewService.getPreviewImageUrl(
                item
              )}})`,
            }}
          />
        )}
      </For>
    </div>
  );
}
