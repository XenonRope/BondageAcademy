import { storeService, type StoreService } from "../store/StoreService";
import type { View } from "./model/View";

export class NavigationService {
  constructor(private storeService: StoreService) {}

  navigate(view: View): void {
    this.storeService.setView(view);
  }
}

export const navigationService = new NavigationService(storeService);
