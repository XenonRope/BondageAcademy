import { Item } from "@bondage-academy/bondage-academy-model";
import { For } from "solid-js";
import { storeService } from "../app/services";
import ItemPreview from "./item-preview";

export default function EquipmentView() {
  function getItems(): Item[] {
    return storeService.getPlayer()?.items ?? [];
  }

  return (
    <div class="grid grid-cols-4 gap-2">
      <For each={getItems()}>{(item) => <ItemPreview item={item} />}</For>
    </div>
  );
}
