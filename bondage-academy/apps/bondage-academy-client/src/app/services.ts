import {
  CharacterPoseValidator,
  ItemCustomizationAccessChecker,
} from "@bondage-academy/bondage-academy-model";
import { AccountService } from "../account/service/account-service";
import { ActionService } from "../action/services/action-service";
import { CharacterLayerService } from "../character/service/character-layer-service";
import { CharacterPoseService } from "../character/service/character-pose-service";
import { ChatService } from "../chat/services/chat-service";
import { DialogueOptionService } from "../chat/services/dialogue-option-service";
import { NavigationService } from "../common/navigation-service";
import { SocketService } from "../common/socket-service";
import { SideMenuService } from "../game/services/side-menu-service";
import { WardrobeService } from "../item/services/wardrobe-service";
import { MinigameService } from "../minigame/services/minigame-service";
import { RoomService } from "../room/services/room-service";
import { StoreService } from "../store/store-service";
import { injector } from "./injector";

export const t = injector.resolve("t");
export const socketService = injector.injectClass(SocketService);
export const store = injector.resolve("store");
export const storeService = injector.injectClass(StoreService);
export const roomService = injector.injectClass(RoomService);
export const minigameService = injector.injectClass(MinigameService);
export const wardrobeService = injector.injectClass(WardrobeService);
export const sideMenuService = injector.injectClass(SideMenuService);
export const translator = injector.resolve("translator");
export const dialogueOptionService = injector.injectClass(
  DialogueOptionService,
);
export const accountService = injector.injectClass(AccountService);
export const navigationService = injector.injectClass(NavigationService);
export const chatService = injector.injectClass(ChatService);
export const characterLayerService = injector.injectClass(
  CharacterLayerService,
);
export const characterPoseService = injector.injectClass(CharacterPoseService);
export const characterPoseValidator = injector.injectClass(
  CharacterPoseValidator,
);
export const actionService = injector.injectClass(ActionService);
export const itemCustomizationAccessChecker = injector.injectClass(
  ItemCustomizationAccessChecker,
);
