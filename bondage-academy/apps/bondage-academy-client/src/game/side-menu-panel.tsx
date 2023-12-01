import type { JSX } from "solid-js/jsx-runtime";
import ActionView from "../action/action-view";
import { sideMenuService, store, storeService, t } from "../app/services";
import CharacterPoseController from "../character/character-pose-controller";
import EquipmentView from "../item/equipment-view";
import WardrobeView from "../item/wardrobe-view";
import { xIcon } from "../ui/icons";
import { SideMenuView } from "./model/side-menu-view";

export default function SideMenuPanel() {
  function renderView(): JSX.Element {
    switch (store.sideMenuView) {
      case SideMenuView.Action:
        return <ActionView />;
      case SideMenuView.CharacterPoses: {
        const player = storeService.getPlayer();
        return (
          player?.character && (
            <CharacterPoseController character={player.character} />
          )
        );
      }
      case SideMenuView.Wardrobe:
        return store.playerId && <WardrobeView playerId={store.playerId} />;
      case SideMenuView.Equipment:
        return <EquipmentView />;
      default:
        return <></>;
    }
  }

  function title(): string | undefined {
    switch (store.sideMenuView) {
      case SideMenuView.Action:
        return t("actionSidePanel.action");
      case SideMenuView.CharacterPoses:
        return t("common.pose");
      case SideMenuView.Wardrobe:
        return t("common.wardrobe");
      case SideMenuView.Equipment:
        return t("common.equipment");
    }
    return undefined;
  }

  return (
    <div class="h-full overflow-auto p-2 bg-primary-50">
      <div class="flex items-center mb-2">
        <div class="text-lg font-bold mr-4">{title()}</div>
        <div class="ml-auto">
          <div
            class="w-5 h-5 text-primary-800 hover:text-primary-700"
            onClick={() => {
              sideMenuService.hideSideMenu();
            }}
          >
            {xIcon()}
          </div>
        </div>
      </div>
      <div>{renderView()}</div>
    </div>
  );
}
