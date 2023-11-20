import { roomService, sideMenuService, store } from "../app/services";
import {
  characterPoseIcon,
  clothIcon,
  equipmentIcon,
  leaveIcon,
} from "../ui/icons";
import { SideMenuView } from "./model/side-menu-view";

export default function SideMenuBar() {
  function toggleSideMenu(sideMenuView: SideMenuView) {
    if (store.sideMenuView === sideMenuView) {
      sideMenuService.hideSideMenu();
    } else {
      sideMenuService.showSideMenu(sideMenuView);
    }
  }

  function leaveRoom() {
    roomService.leaveRoom().catch(console.log);
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
        <div class="relative h-full left-[6px] top-[1px] py-[2px]">
          {characterPoseIcon}
        </div>
      </div>
      <div
        class="h-[52px] w-[52px] bg-yellow-100 border-2 border-black mt-[-2px]"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        <div class="relative top-[6px] left-[-1px] px-[2px]">{clothIcon}</div>
      </div>
      <div
        onClick={() => toggleSideMenu(SideMenuView.Equipment)}
        class="h-[52px] w-[52px] bg-yellow-100 border-2 border-black mt-[-2px]"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        <div class="relative top-[2px] px-[2px]">{equipmentIcon}</div>
      </div>
      <div
        onClick={leaveRoom}
        class="h-[52px] w-[52px] bg-yellow-100 border-2 border-black mt-[-2px]"
        style={{ "writing-mode": "horizontal-tb" }}
      >
        <div class="relative top-[4px] px-[2px]">{leaveIcon}</div>
      </div>
    </div>
  );
}
