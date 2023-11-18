import { AccountApi } from "../account/AccountApi";
import { CharacterPoseApi } from "../character/CharacterPoseApi";
import { MovementApi } from "../movement/MovementApi";
import {
  accountRegistrationService,
  characterPoseService,
  loginService,
  movementService,
  playerStoreService,
  worldObjectSynchronizationService,
} from "./services";

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService,
  worldObjectSynchronizationService,
  playerStoreService
);

export const characterPoseApi = new CharacterPoseApi(characterPoseService);

export const movementApi = new MovementApi(movementService);
