import { type StoreService } from "../store/store-service";
import type { View } from "./model/view";

export class NavigationService {
  constructor(private storeService: StoreService) {}

  navigate(view: View): void {
    this.storeService.setView(view);
  }
}
