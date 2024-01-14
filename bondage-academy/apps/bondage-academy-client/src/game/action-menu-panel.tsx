import { JSX } from "solid-js/jsx-runtime";
import { sideMenuService, store, t } from "../app/services";
import WardrobeView from "../item/wardrobe-view";
import { xIcon } from "../ui/icons";
import { ActionMenuView } from "./model/action-menu-view";

export default function ActionMenuPanel() {
  function renderView(): JSX.Element {
    switch (store.actionMenuView) {
      case ActionMenuView.Wardrobe:
        return (
          store.selectedActor && <WardrobeView actor={store.selectedActor} />
        );
      default:
        return <></>;
    }
  }

  function title(): string | undefined {
    switch (store.actionMenuView) {
      case ActionMenuView.Wardrobe:
        return t("common.wardrobe");
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
              sideMenuService.hideActionMenu();
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
