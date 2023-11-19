import { Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { sideMenuService, store, storeService } from "../app/services";
import CharacterPoseController from "../character/character-pose-controller";
import EquipmentView from "../item/equipment-view";
import Button from "../ui/button";
import { SideMenuView } from "./model/side-menu-view";

export default function SideMenuPanel() {
  function renderView(): JSX.Element {
    switch (store.sideMenuView) {
      case SideMenuView.CharacterPoses: {
        const player = storeService.getPlayer();
        return (
          player?.character && (
            <CharacterPoseController character={player.character} />
          )
        );
      }
      case SideMenuView.Equipment:
        return <EquipmentView />;
      default:
        return <></>;
    }
  }

  return (
    <Show when={store.sideMenuView != null}>
      <div class="absolute h-full overflow-auto p-2 bg-yellow-100">
        <div class="mb-2">
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
