import { storeService, type StoreService } from "../../store/StoreService";
import type { SideMenuView } from "../model/SideMenuView";

export class SideMenuService {
  constructor(private storeService: StoreService) {}

  showSideMenu(sideMenuView: SideMenuView) {
    this.storeService.setSideMenuView(sideMenuView);
  }

  hideSideMenu() {
    this.storeService.setSideMenuView(undefined);
  }
}

export const sideMenuService = new SideMenuService(storeService);
