import {
  CharacterPoseValidator,
  ItemCustomizationAccessChecker,
} from "@bondage-academy/bondage-academy-model";
import { container } from "tsyringe";
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
import {
  SIMPLE_TRANSLATOR,
  TRANSLATOR,
} from "../locale/services/locale-service";
import { MinigameService } from "../minigame/services/minigame-service";
import { RoomService } from "../room/services/room-service";
import { STORE, StoreService } from "../store/store-service";

export const store = container.resolve(STORE);
export const t = container.resolve(SIMPLE_TRANSLATOR);
export const translator = container.resolve(TRANSLATOR);
export const socketService = container.resolve(SocketService);
export const storeService = container.resolve(StoreService);
export const roomService = container.resolve(RoomService);
export const wardrobeService = container.resolve(WardrobeService);
export const sideMenuService = container.resolve(SideMenuService);
export const accountService = container.resolve(AccountService);
export const navigationService = container.resolve(NavigationService);
export const dialogueOptionService = container.resolve(DialogueOptionService);
export const chatService = container.resolve(ChatService);
export const characterLayerService = container.resolve(CharacterLayerService);
export const characterPoseService = container.resolve(CharacterPoseService);
export const characterPoseValidator = container.resolve(CharacterPoseValidator);
export const actionService = container.resolve(ActionService);
export const itemCustomizationAccessChecker = container.resolve(
  ItemCustomizationAccessChecker,
);
export const minigameService = container.resolve(MinigameService);
