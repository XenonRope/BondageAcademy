import { store } from "../store/StoreService";
import { characterPoseIcon, clothIcon } from "../ui/Icons";
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
        onClick={() => toggleSideMenu(SideMenuView.CharacterPoses)}
        class="h-[52px] w-[52px] bg-yellow-100 border-2 border-black"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        <div class="relative h-full left-[5px] top-[1px] py-[2px]">
          {characterPoseIcon}
        </div>
      </div>
      <div
        class="h-[52px] w-[52px] bg-yellow-100 border-2 border-black mt-[-2px]"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        <div class="relative top-[5px] left-[-1px] px-[2px]">{clothIcon}</div>
      </div>
    </div>
  );
}
