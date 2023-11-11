import { Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import CharacterPoseController from "../character/CharacterPoseController";
import { storeService } from "../store/StoreService";
import Button from "../ui/Button";
import { SideMenuView } from "./model/SideMenuView";
import { sideMenuService } from "./services/SideMenuService";

export default function SideMenuPanel() {
  const store = storeService.getStore();

  function renderView(): JSX.Element {
    switch (store.sideMenuView) {
      case SideMenuView.CharacterPoses:
        return (
          store.player?.character != null && (
            <CharacterPoseController character={store.player?.character} />
          )
        );
    }
  }

  return (
    <Show when={store.sideMenuView != null}>
      <div class="absolute h-full overflow-auto bg-yellow-100">
        <div>
          <Button
            onClick={() => {
              sideMenuService.hideSideMenu();
            }}
          >
            Close
          </Button>
        </div>
        <div>{renderView()}</div>
      </div>
    </Show>
  );
}
