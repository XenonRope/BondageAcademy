import { DIContainer } from "@bondage-academy/rsdi";
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
import { ServiceContainer } from "./services";

export type ApiContainer = ReturnType<typeof configureApiContainer>;

export const configureApiContainer = (serviceContainer: ServiceContainer) => {
  return new DIContainer()
    .add(
      "accountApi",
      () =>
        new AccountApi(
          serviceContainer.accountRegistrationService,
          serviceContainer.loginService,
          serviceContainer.playerStoreService,
          serviceContainer.roomUtilsService
        )
    )
    .add(
      "characterPoseApi",
      () =>
        new CharacterPoseApi(
          serviceContainer.characterPoseService,
          serviceContainer.minigameService,
          serviceContainer.actorService
        )
    )
    .add(
      "movementApi",
      () =>
        new MovementApi(
          serviceContainer.movementService,
          serviceContainer.minigameService
        )
    )
    .add(
      "roomJoinApi",
      () =>
        new RoomJoinApi(
          serviceContainer.roomJoinService,
          serviceContainer.roomUtilsService
        )
    )
    .add(
      "roomCreationApi",
      () =>
        new RoomCreationApi(
          serviceContainer.roomStoreService,
          serviceContainer.roomService,
          serviceContainer.roomCreationService,
          serviceContainer.roomJoinService,
          serviceContainer.roomUtilsService,
          serviceContainer.playerStoreService
        )
    )
    .add(
      "roomLeaveApi",
      () =>
        new RoomLeaveApi(
          serviceContainer.roomLeaveService,
          serviceContainer.minigameService
        )
    )
    .add(
      "roomSearchApi",
      () => new RoomSearchApi(serviceContainer.roomSearchService)
    )
    .add(
      "chatSpeakApi",
      () =>
        new ChatSpeakApi(
          serviceContainer.chatSpeakService,
          serviceContainer.minigameService
        )
    )
    .add(
      "dialogueOptionApi",
      () =>
        new DialogueOptionApi(
          serviceContainer.dialogueOptionService,
          serviceContainer.minigameService
        )
    )
    .add(
      "wardrobeApi",
      () =>
        new WardrobeApi(
          serviceContainer.wardrobeChangeService,
          serviceContainer.minigameService,
          serviceContainer.wardrobeCustomizationService
        )
    )
    .add("minigameApi", () => new MinigameApi(serviceContainer.minigameService))
    .add(
      "actionApi",
      () =>
        new ActionApi(
          serviceContainer.actionExecutorService,
          serviceContainer.minigameService
        )
    );
};
