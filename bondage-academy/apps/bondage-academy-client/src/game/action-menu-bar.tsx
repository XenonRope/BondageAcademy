import { Show } from "solid-js";
import { sideMenuService, store } from "../app/services";
import { clothIcon } from "../ui/icons";
import { ActionMenuView } from "./model/action-menu-view";

export default function ActionMenuBar() {
  function toggleActionMenu(view: ActionMenuView) {
    if (store.actionMenuView === view) {
      sideMenuService.hideActionMenu();
    } else {
      sideMenuService.showActionMenu(view);
    }
  }

  return (
    <div
      class="flex flex-wrap h-full min-w-[52px]"
      style={{
        "writing-mode": "vertical-lr",
      }}
    >
      <Show
        when={store.selectedPlayer && store.selectedPlayer !== store.playerId}
      >
        <div
          onClick={() => toggleActionMenu(ActionMenuView.Wardrobe)}
          class="h-[52px] w-[52px] mb-[3px] bg-yellow-100 hover:bg-yellow-200"
          style={{
            "writing-mode": "horizontal-tb",
          }}
        >
          <div class="relative top-[6px] left-[-1px] px-[2px]">
            {clothIcon()}
          </div>
        </div>
      </Show>
    </div>
  );
}
