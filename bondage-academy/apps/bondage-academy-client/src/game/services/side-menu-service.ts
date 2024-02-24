import { inject, singleton } from "tsyringe";
import { StoreService } from "../../store/store-service";
import { ActionMenuView } from "../model/action-menu-view";
import type { SideMenuView } from "../model/side-menu-view";

@singleton()
export class SideMenuService {
  constructor(@inject(StoreService) private storeService: StoreService) {}

  showSideMenu(view: SideMenuView) {
    this.storeService.setSideMenuView(view);
    this.storeService.setActionMenuView(undefined);
  }

  hideSideMenu() {
    this.storeService.setSideMenuView(undefined);
  }

  showActionMenu(view: ActionMenuView) {
    this.storeService.setActionMenuView(view);
    this.storeService.setSideMenuView(undefined);
  }

  hideActionMenu() {
    this.storeService.setActionMenuView(undefined);
  }
}
