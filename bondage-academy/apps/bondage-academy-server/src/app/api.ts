import { AccountApi } from "../account/account-api";
import { CharacterPoseApi } from "../character/character-pose-api";
import { MovementApi } from "../movement/movement-api";
import { RoomCreationApi } from "../room/room-creation-api";
import { RoomJoinApi } from "../room/room-join-api";
import {
  accountRegistrationService,
  characterPoseService,
  loginService,
  movementService,
  playerStoreService,
  roomCreationService,
  roomJoinService,
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
  roomUtilsService
);
