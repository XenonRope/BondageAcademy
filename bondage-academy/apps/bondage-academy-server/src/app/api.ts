import { AccountApi } from "../account/account-api";
import { CharacterPoseApi } from "../character/character-pose-api";
import { MovementApi } from "../movement/movement-api";
import {
  accountRegistrationService,
  characterPoseService,
  loginService,
  movementService,
  playerStoreService,
  roomStoreService,
} from "./services";

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService,
  playerStoreService,
  roomStoreService
);

export const characterPoseApi = new CharacterPoseApi(characterPoseService);

export const movementApi = new MovementApi(movementService);
