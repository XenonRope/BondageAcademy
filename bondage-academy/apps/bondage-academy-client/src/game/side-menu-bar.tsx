import { createMemo } from "solid-js";
import {
  roomService,
  sideMenuService,
  store,
  storeService,
} from "../app/services";
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
    if (canLeave()) {
      roomService.leaveRoom().catch(console.log);
    }
  }

  const canLeave = createMemo(() => {
    if (!store.room) {
      return false;
    }

    const playerPosition = storeService.getPlayerObject()?.position;
    if (!playerPosition) {
      return false;
    }

    for (const transitArea of store.room.transitAreas) {
      if (
        playerPosition.x >= transitArea.x &&
        playerPosition.x < transitArea.x + transitArea.width &&
        playerPosition.y >= transitArea.y &&
        playerPosition.y < transitArea.y + transitArea.height
      ) {
        return true;
      }
    }

    return false;
  });

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
        style={{
          "writing-mode": "horizontal-tb",
          "background-color": canLeave() ? undefined : "gray",
        }}
      >
        <div class="relative top-[4px] px-[2px]">{leaveIcon}</div>
      </div>
    </div>
  );
}
