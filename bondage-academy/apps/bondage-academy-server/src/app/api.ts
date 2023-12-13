import { DIContainer } from "rsdi";
import { AccountApi } from "../account/account-api";
import { ActionApi } from "../action/action-api";
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
import { serviceDIContainer } from "./services";

export const apiDIContainer = new DIContainer()
  .add(
    "accountApi",
    () =>
      new AccountApi(
        serviceDIContainer.accountRegistrationService,
        serviceDIContainer.loginService,
        serviceDIContainer.playerStoreService,
        serviceDIContainer.roomUtilsService
      )
  )
  .add(
    "characterPoseApi",
    () =>
      new CharacterPoseApi(
        serviceDIContainer.characterPoseService,
        serviceDIContainer.minigameService
      )
  )
  .add(
    "movementApi",
    () =>
      new MovementApi(
        serviceDIContainer.movementService,
        serviceDIContainer.minigameService
      )
  )
  .add(
    "roomJoinApi",
    () =>
      new RoomJoinApi(
        serviceDIContainer.roomJoinService,
        serviceDIContainer.roomUtilsService
      )
  )
  .add(
    "roomCreationApi",
    () =>
      new RoomCreationApi(
        serviceDIContainer.roomStoreService,
        serviceDIContainer.roomService,
        serviceDIContainer.roomCreationService,
        serviceDIContainer.roomJoinService,
        serviceDIContainer.roomUtilsService,
        serviceDIContainer.playerStoreService
      )
  )
  .add(
    "roomLeaveApi",
    () =>
      new RoomLeaveApi(
        serviceDIContainer.roomLeaveService,
        serviceDIContainer.minigameService
      )
  )
  .add(
    "roomSearchApi",
    () => new RoomSearchApi(serviceDIContainer.roomSearchService)
  )
  .add(
    "chatSpeakApi",
    () =>
      new ChatSpeakApi(
        serviceDIContainer.chatSpeakService,
        serviceDIContainer.minigameService
      )
  )
  .add(
    "dialogueOptionApi",
    () =>
      new DialogueOptionApi(
        serviceDIContainer.dialogueOptionService,
        serviceDIContainer.minigameService
      )
  )
  .add(
    "wardrobeApi",
    () =>
      new WardrobeApi(
        serviceDIContainer.wardrobeChangeService,
        serviceDIContainer.minigameService
      )
  )
  .add("minigameApi", () => new MinigameApi(serviceDIContainer.minigameService))
  .add(
    "actionApi",
    () =>
      new ActionApi(
        serviceDIContainer.actionService,
        serviceDIContainer.minigameService
      )
  );
