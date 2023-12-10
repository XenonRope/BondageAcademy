import {
  CharacterPoseValidator,
  DictionaryKey,
} from "@bondage-academy/bondage-academy-model";
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
import { Translator } from "../locale/model/translator";
import { LocaleService } from "../locale/services/locale-service";
import { MinigameService } from "../minigame/services/minigame-service";
import { NPCCharacterService } from "../npc/npc-character-service";
import { RoomService } from "../room/services/room-service";
import type { Store } from "../store/model/store";
import { StoreService } from "../store/store-service";

const [store, setStore] = createStore<Store>({ locale: "en", view: View.Home });

export { store };

export const characterPoseValidator = new CharacterPoseValidator();

export const npcCharacterService = new NPCCharacterService();

export const storeService = new StoreService(store, setStore);

export const socketService = new SocketService(store);

export const accountService = new AccountService(socketService, storeService);

export const characterLayerService = new CharacterLayerService();

export const characterPoseService = new CharacterPoseService(socketService);

export const navigationService = new NavigationService(storeService);

export const sideMenuService = new SideMenuService(storeService);

export const roomService = new RoomService(socketService, storeService);

export const chatService = new ChatService(socketService);

export const localeService = new LocaleService(store);

export const dialogueOptionService = new DialogueOptionService(
  store,
  socketService
);

export const wardrobeService = new WardrobeService(socketService);

export const actionService = new ActionService(socketService);

export const minigameService = new MinigameService(socketService);

export const translator: Translator = localeService.createTranslator();

export const t = (dictionaryKey: DictionaryKey): string =>
  translator({ dictionaryKey });
