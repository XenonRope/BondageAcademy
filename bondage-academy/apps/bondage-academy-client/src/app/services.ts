import type { NullableTranslator } from "@solid-primitives/i18n";
import { createStore } from "solid-js/store";
import { AccountService } from "../account/service/account-service";
import { CharacterLayerService } from "../character/service/character-layer-service";
import { CharacterPoseService } from "../character/service/character-pose-service";
import { View } from "../common/model/view";
import { NavigationService } from "../common/navigation-service";
import { SocketService } from "../common/socket-service";
import { SideMenuService } from "../game/services/side-menu-service";
import {
  LocaleService,
  type Dictionary,
} from "../locale/services/locale-service";
import type { Store } from "../store/model/store";
import { StoreService } from "../store/store-service";

const [store, setStore] = createStore<Store>({ locale: "en", view: View.Home });

export { store };

export const storeService = new StoreService(store, setStore);

export const socketService = new SocketService(store);

export const accountService = new AccountService(socketService, storeService);

export const characterLayerService = new CharacterLayerService();

export const characterPoseService = new CharacterPoseService(socketService);

export const navigationService = new NavigationService(storeService);

export const sideMenuService = new SideMenuService(storeService);

export const localeService = new LocaleService(store);

export const t: NullableTranslator<Dictionary> =
  localeService.createTranslator();