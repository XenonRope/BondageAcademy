import { For } from "solid-js";
import { store } from "../store/StoreService";
import { itemPreviewService } from "./services/ItemPreviewService";

export default function EquipmentView() {
  return (
    <div>
      <For each={store?.player?.items ?? []}>
        {(item) => (
          <div
            class="h-[96px] w-[96px]"
            style={{
              "background-image": `url(${itemPreviewService.getPreviewImageUrl(
                item,
              )}})`,
            }}
          />
        )}
      </For>
    </div>
  );
}
