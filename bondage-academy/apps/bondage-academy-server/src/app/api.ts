import { AccountApi } from "../account/account-api";
import { CharacterPoseApi } from "../character/character-pose-api";
import { ChatSpeakApi } from "../chat/chat-speak-api";
import { DialogueOptionApi } from "../chat/dialogue-option-api";
import { MinigameApi } from "../minigame/minigame-api";
import { MovementApi } from "../movement/movement-api";
import { RoomCreationApi } from "../room/room-creation-api";
import { RoomJoinApi } from "../room/room-join-api";
import { RoomLeaveApi } from "../room/room-leave-api";
import { RoomSearchApi } from "../room/room-search-api";
import { WardrobeApi } from "../wardrobe/wardrobe-api";
import {
  accountRegistrationService,
  characterPoseService,
  chatSpeakService,
  dialogueOptionService,
  loginService,
  minigameService,
  movementService,
  playerStoreService,
  roomCreationService,
  roomJoinService,
  roomLeaveService,
  roomSearchService,
  roomService,
  roomStoreService,
  roomUtilsService,
  wardrobeChangeServiec as wardrobeChangeService,
} from "./services";

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService,
  playerStoreService,
  roomUtilsService
);

export const characterPoseApi = new CharacterPoseApi(
  characterPoseService,
  minigameService
);

export const movementApi = new MovementApi(movementService, minigameService);

export const roomJoinApi = new RoomJoinApi(roomJoinService, roomUtilsService);

export const roomCreationApi = new RoomCreationApi(
  roomStoreService,
  roomService,
  roomCreationService,
  roomJoinService,
  roomUtilsService,
  playerStoreService
);

export const roomLeaveApi = new RoomLeaveApi(roomLeaveService, minigameService);

export const roomSearchApi = new RoomSearchApi(roomSearchService);

export const chatSpeakApi = new ChatSpeakApi(chatSpeakService, minigameService);

export const dialogueOptionApi = new DialogueOptionApi(
  dialogueOptionService,
  minigameService
);

export const wardrobeApi = new WardrobeApi(
  wardrobeChangeService,
  minigameService
);

export const minigameApi = new MinigameApi(minigameService);
