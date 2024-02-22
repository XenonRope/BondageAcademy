import {
  CharacterPoseValidator,
  DictionaryKey,
  ItemCustomizationAccessChecker,
} from "@bondage-academy/bondage-academy-model";
import { createStore } from "solid-js/store";
import { createInjector } from "typed-inject";
import { AccountService } from "../account/service/account-service";
import { ActionService } from "../action/services/action-service";
import { CharacterLayerService } from "../character/service/character-layer-service";
import { CharacterPoseService } from "../character/service/character-pose-service";
import { ChatService } from "../chat/services/chat-service";
import { DialogueOptionService } from "../chat/services/dialogue-option-service";
import { View } from "../common/model/view";
import { NavigationService } from "../common/navigation-service";
import { SocketService } from "../common/socket-service";
import { SideMenuService } from "../game/services/side-menu-service";
import { WardrobeService } from "../item/services/wardrobe-service";
import { SimpleTranslator, Translator } from "../locale/model/translator";
import { LocaleService } from "../locale/services/locale-service";
import { MinigameService } from "../minigame/services/minigame-service";
import { RoomService } from "../room/services/room-service";
import { Store } from "../store/model/store";
import { StoreService } from "../store/store-service";

const [store, setStore] = createStore<Store>({
  locale: "en",
  view: View.Home,
});

translatorFactory.inject = ["localeService"] as const;
function translatorFactory(localeService: LocaleService): Translator {
  return localeService.createTranslator();
}

tFactory.inject = ["translator"] as const;
function tFactory(translator: Translator): SimpleTranslator {
  return (dictionaryKey: DictionaryKey): string =>
    translator({ dictionaryKey });
}

export const injector = createInjector()
  .provideValue("store", store)
  .provideValue("setStore", setStore)
  .provideClass(
    "itemCustomizationAccessChecker",
    ItemCustomizationAccessChecker,
  )
  .provideClass("characterPoseValidator", CharacterPoseValidator)
  .provideClass("storeService", StoreService)
  .provideClass("socketService", SocketService)
  .provideClass("accountService", AccountService)
  .provideClass("characterLayerService", CharacterLayerService)
  .provideClass("characterPoseService", CharacterPoseService)
  .provideClass("navigationService", NavigationService)
  .provideClass("sideMenuService", SideMenuService)
  .provideClass("roomService", RoomService)
  .provideClass("chatService", ChatService)
  .provideClass("localeService", LocaleService)
  .provideClass("dialogueOptionService", DialogueOptionService)
  .provideClass("wardrobeService", WardrobeService)
  .provideClass("actionService", ActionService)
  .provideClass("minigameService", MinigameService)
  .provideFactory("translator", translatorFactory)
  .provideFactory("t", tFactory);
