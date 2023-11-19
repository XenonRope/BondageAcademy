import { type StoreService } from "../../store/store-service";
import type { SideMenuView } from "../model/side-menu-view";

export class SideMenuService {
  constructor(private storeService: StoreService) {}

  showSideMenu(sideMenuView: SideMenuView) {
    this.storeService.setSideMenuView(sideMenuView);
  }

  hideSideMenu() {
    this.storeService.setSideMenuView(undefined);
  }
}
