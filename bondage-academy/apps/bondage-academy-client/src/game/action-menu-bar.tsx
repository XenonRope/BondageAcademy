import { Show, createMemo } from "solid-js";
import { storeService } from "../app/services";
import { characterPoseIcon } from "../ui/icons";

export default function ActionMenuBar() {
  const selectedPlayer = createMemo(() => storeService.getSelectedPlayer());

  return (
    <div
      class="flex flex-wrap h-full min-w-[52px]"
      style={{
        "writing-mode": "vertical-lr",
      }}
    >
      <Show when={selectedPlayer()}>
        <div
          class="h-[52px] w-[52px] mb-[3px] bg-yellow-100 hover:bg-yellow-200"
          style={{
            "writing-mode": "horizontal-tb",
          }}
        >
          <div class="relative h-full left-[6px] top-[1px] py-[2px]">
            {characterPoseIcon()}
          </div>
        </div>
      </Show>
    </div>
  );
}
