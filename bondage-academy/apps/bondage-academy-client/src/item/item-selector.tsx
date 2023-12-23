import { Item } from "@bondage-academy/bondage-academy-model";
import { For } from "solid-js";
import ItemPreview from "./item-preview";

export default function ItemSelector(props: {
  items: Item[];
  onSelect?: (item: Item) => void;
}) {
  return (
    <div class="grid grid-cols-4 gap-2 w-fit">
      <For each={props.items}>
        {(item) => (
          <ItemPreview
            itemCode={item.code}
            onClick={() => props.onSelect?.(item)}
          />
        )}
      </For>
    </div>
  );
}
