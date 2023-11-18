import type { NullableTranslator } from "@solid-primitives/i18n";
import { createStore } from "solid-js/store";
import { AccountService } from "../account/service/AccountService";
import { CharacterLayerService } from "../character/service/CharacterLayerService";
import { CharacterPoseService } from "../character/service/CharacterPoseService";
import { NavigationService } from "../common/NavigationService";
import { SocketService } from "../common/SocketService";
import { View } from "../common/model/View";
import { SideMenuService } from "../game/services/SideMenuService";
import {
  LocaleService,
  type Dictionary,
} from "../locale/services/LocaleService";
import { StoreService } from "../store/StoreService";
import type { Store } from "../store/model/store";

const [store, setStore] = createStore<Store>({ locale: "en", view: View.Home });

export { store };

export const storeService = new StoreService(setStore);

export const socketService = new SocketService(store);

export const accountService = new AccountService(socketService, storeService);

export const characterLayerService = new CharacterLayerService();

export const characterPoseService = new CharacterPoseService(socketService);

export const navigationService = new NavigationService(storeService);

export const sideMenuService = new SideMenuService(storeService);

export const localeService = new LocaleService(store);

export const t: NullableTranslator<Dictionary> =
  localeService.createTranslator();
