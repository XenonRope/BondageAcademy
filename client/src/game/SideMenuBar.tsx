import { store } from "../store/StoreService";
import { SideMenuView } from "./model/SideMenuView";
import { sideMenuService } from "./services/SideMenuService";

export default function SideMenuBar() {
  function toggleSideMenu(sideMenuView: SideMenuView) {
    if (store.sideMenuView === sideMenuView) {
      sideMenuService.hideSideMenu();
    } else {
      sideMenuService.showSideMenu(sideMenuView);
    }
  }

  return (
    <div
      class="flex flex-wrap h-full bg-gray-100"
      style={{ "writing-mode": "vertical-lr" }}
    >
      <div
        onClick={() => {
          toggleSideMenu(SideMenuView.CharacterPoses);
        }}
        class="h-[48px] w-[48px] bg-red-500"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        1
      </div>
      <div
        class="h-[48px] w-[48px] bg-green-500"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        2
      </div>
      <div
        class="h-[48px] w-[48px] bg-red-500"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        3
      </div>
      <div
        class="h-[48px] w-[48px] bg-green-500"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        4
      </div>
      <div
        class="h-[48px] w-[48px] bg-red-500"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        5
      </div>
    </div>
  );
}
