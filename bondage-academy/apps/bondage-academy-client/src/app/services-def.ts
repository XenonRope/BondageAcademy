import {
  CharacterPoseValidator,
  DictionaryKey,
  ItemCustomizationAccessChecker,
} from "@bondage-academy/bondage-academy-model";
import { DIContainer } from "@bondage-academy/rsdi";
import { createStore } from "solid-js/store";
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
import { LocaleService } from "../locale/services/locale-service";
import { MinigameService } from "../minigame/services/minigame-service";
import { NPCCharacterService } from "../npc/npc-character-service";
import { RoomService } from "../room/services/room-service";
import type { Store } from "../store/model/store";
import { StoreService } from "../store/store-service";

export type ServiceContainer = ReturnType<typeof configureServiceContainer>;

export const configureServiceContainer = () => {
  const [store, setStore] = createStore<Store>({
    locale: "en",
    view: View.Home,
  });

  return new DIContainer()
    .add("store", () => store)
    .add("setStore", () => setStore)
    .add(
      "itemCustomizationAccessChecker",
      () => new ItemCustomizationAccessChecker()
    )
    .add("characterPoseValidator", () => new CharacterPoseValidator())
    .add("npcCharacterService", () => new NPCCharacterService())
    .add(
      "storeService",
      ({ store, setStore }) => new StoreService(store, setStore)
    )
    .add("socketService", ({ store }) => new SocketService(store))
    .add(
      "accountService",
      ({ socketService, storeService }) =>
        new AccountService(socketService, storeService)
    )
    .add("characterLayerService", () => new CharacterLayerService())
    .add(
      "characterPoseService",
      ({ socketService, characterPoseValidator }) =>
        new CharacterPoseService(socketService, characterPoseValidator)
    )
    .add(
      "navigationService",
      ({ storeService }) => new NavigationService(storeService)
    )
    .add(
      "sideMenuService",
      ({ storeService }) => new SideMenuService(storeService)
    )
    .add(
      "roomService",
      ({ socketService, storeService }) =>
        new RoomService(socketService, storeService)
    )
    .add("chatService", ({ socketService }) => new ChatService(socketService))
    .add("localeService", ({ store }) => new LocaleService(store))
    .add(
      "dialogueOptionService",
      ({ store, socketService }) =>
        new DialogueOptionService(store, socketService)
    )
    .add(
      "wardrobeService",
      ({ socketService }) => new WardrobeService(socketService)
    )
    .add(
      "actionService",
      ({ socketService }) => new ActionService(socketService)
    )
    .add(
      "minigameService",
      ({ socketService }) => new MinigameService(socketService)
    )
    .add("translator", ({ localeService }) => localeService.createTranslator())
    .add(
      "t",
      ({ translator }) =>
        (dictionaryKey: DictionaryKey): string =>
          translator({ dictionaryKey })
    );
};
