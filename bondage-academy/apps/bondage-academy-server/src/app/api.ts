import { AccountApi } from "../account/account-api";
import { CharacterPoseApi } from "../character/character-pose-api";
import { ChatSpeakApi } from "../chat/chat-speak-api";
import { MovementApi } from "../movement/movement-api";
import { RoomCreationApi } from "../room/room-creation-api";
import { RoomJoinApi } from "../room/room-join-api";
import { RoomLeaveApi } from "../room/room-leave-api";
import { RoomSearchApi } from "../room/room-search-api";
import {
  accountRegistrationService,
  characterPoseService,
  chatSpeakService,
  loginService,
  movementService,
  playerStoreService,
  roomCreationService,
  roomJoinService,
  roomLeaveService,
  roomSearchService,
  roomService,
  roomStoreService,
  roomUtilsService,
} from "./services";

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService,
  playerStoreService,
  roomUtilsService
);

export const characterPoseApi = new CharacterPoseApi(characterPoseService);

export const movementApi = new MovementApi(movementService);

export const roomJoinApi = new RoomJoinApi(roomJoinService, roomUtilsService);

export const roomCreationApi = new RoomCreationApi(
  roomStoreService,
  roomService,
  roomCreationService,
  roomJoinService,
  roomUtilsService,
  playerStoreService
);

export const roomLeaveApi = new RoomLeaveApi(roomLeaveService);

export const roomSearchApi = new RoomSearchApi(roomSearchService);

export const chatSpeakApi = new ChatSpeakApi(chatSpeakService);
