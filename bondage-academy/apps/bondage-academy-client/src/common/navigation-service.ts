import { inject, singleton } from "tsyringe";
import { StoreService } from "../store/store-service";
import type { View } from "./model/view";

@singleton()
export class NavigationService {
  constructor(@inject(StoreService) private storeService: StoreService) {}

  navigate(view: View): void {
    this.storeService.setView(view);
  }
}
