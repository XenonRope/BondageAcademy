import { setStore } from "./Store";
import type { View } from "./model/View";

export class NavigationService {
  navigate(view: View): void {
    setStore({ view });
  }
}

export const navigationService = new NavigationService();
