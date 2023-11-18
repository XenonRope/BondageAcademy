import { AccountApi } from "../account/AccountApi";
import { CharacterPoseApi } from "../character/CharacterPoseApi";
import { MovementApi } from "../movement/MovementApi";
import {
  accountRegistrationService,
  loginService,
  worldObjectSynchronizationService,
  playerStoreService,
  characterPoseService,
  movementService,
} from "./Services";

export const accountApi = new AccountApi(
  accountRegistrationService,
  loginService,
  worldObjectSynchronizationService,
  playerStoreService
);

export const characterPoseApi = new CharacterPoseApi(characterPoseService);

export const movementApi = new MovementApi(movementService);
