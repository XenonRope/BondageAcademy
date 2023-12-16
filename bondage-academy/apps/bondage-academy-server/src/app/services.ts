import {
  CharacterPoseValidator,
  dialogueOptions,
} from "@bondage-academy/bondage-academy-model";
import { DIContainer } from "@bondage-academy/rsdi";
import { AccountRegistrationService } from "../account/account-registration-service";
import { AccountService } from "../account/account-service";
import { LoginService } from "../account/login-service";
import { LogoutService } from "../account/logout-service";
import { ActionService } from "../action/action-service";
import { SmileActionHandler } from "../action/handler/smile-action-handler";
import { CharacterPoseService } from "../character/character-pose-service";
import { ChatService } from "../chat/chat-service";
import { ChatSpeakService } from "../chat/chat-speak-service";
import { DialogueOptionService } from "../chat/dialogue-option-service";
import { Dao } from "../dao/dao";
import { Sequences } from "../dao/sequences";
import { ItemIdProvider } from "../item/item-id-provider";
import { ItemService } from "../item/item-service";
import { MigrationService } from "../migration/migration-service";
import { ClickMinigameChallangeHandler } from "../minigame/challange/click-minigame-challange-handler";
import { MinigameChallangeService } from "../minigame/minigame-challange-service";
import { MinigameClientSynchronizationService } from "../minigame/minigame-client-synchronization-service";
import { MinigameService } from "../minigame/minigame-service";
import { MinigameStakeService } from "../minigame/minigame-stake-service";
import { ChangeWardrobeMinigameStakeHandler } from "../minigame/stake/change-wardrobe-minigame-stake-handler";
import { WardrobeMinigameService } from "../minigame/wardrobe-minigame-service";
import { MotionStorage } from "../movement/motion-storage";
import { MovementConditionChecker } from "../movement/movement-condition-checker";
import { MovementService } from "../movement/movement-service";
import { ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { ObjectCreationService } from "../object/object-creation-service";
import { ObjectIdProvider } from "../object/object-id-provider";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerCreationService } from "../player/player-creation-service";
import { PlayerDatabaseSynchronizationService } from "../player/player-database-synchronization-service";
import { PlayerService } from "../player/player-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomCreationService } from "../room/room-creation-service";
import { RoomDatabaseSynchronizationService } from "../room/room-database-synchronization-service";
import { RoomFieldService } from "../room/room-field-service";
import { RoomInitializationService } from "../room/room-initialization-service";
import { RoomJoinService } from "../room/room-join-service";
import { RoomLeaveService } from "../room/room-leave-service";
import { RoomObjectCreationService } from "../room/room-object-creation-service";
import { RoomObjectRemovalService } from "../room/room-object-removal-service";
import { RoomSearchService } from "../room/room-search-service";
import { RoomService } from "../room/room-service";
import { RoomSessionService } from "../room/room-session-service";
import { RoomStoreService } from "../room/room-store-service";
import { RoomUtilsService } from "../room/room-utils-service";
import { ScriptService } from "../script/script-service";
import { HeadmistressScript } from "../script/scripts/headmistress-script";
import { SessionService } from "../session/session-service";
import { DatabaseSynchronizationService } from "../synchronization/database-synchronization-service";
import { WardrobeChangeService } from "../wardrobe/wardrobe-change-service";
import { WardrobeConditionChecker } from "../wardrobe/wardrobe-condition-checker";
import { WardrobeService } from "../wardrobe/wardrobe-service";

export type ServiceContainer = ReturnType<typeof configureServiceContainer>;

export const configureServiceContainer = () => {
  return new DIContainer()
    .add("characterPoseValidator", () => new CharacterPoseValidator())
    .add(
      "dao",
      () => new Dao("mongodb://root:root@localhost:27017/admin?replicaSet=rs0")
    )
    .add("sequences", ({ dao }) => new Sequences(dao))
    .add("objectIdProvider", ({ sequences }) => new ObjectIdProvider(sequences))
    .add("playerService", ({ dao }) => new PlayerService(dao))
    .add(
      "playerStoreService",
      ({ playerService }) => new PlayerStoreService(playerService)
    )
    .add("scriptService", () => new ScriptService())
    .add(
      "objectClientSynchronizationService",
      () => new ObjectClientSynchronizationService()
    )
    .add("motionStorage", () => new MotionStorage())
    .add("sessionService", () => new SessionService())
    .add("roomService", ({ dao }) => new RoomService(dao))
    .add(
      "playerDatabaseSynchronizationService",
      ({ playerStoreService, playerService }) =>
        new PlayerDatabaseSynchronizationService(
          playerStoreService,
          playerService
        )
    )
    .add(
      "roomStoreService",
      ({ roomService }) => new RoomStoreService(roomService)
    )
    .add(
      "roomSessionService",
      ({ sessionService, roomStoreService, playerStoreService }) =>
        new RoomSessionService(
          sessionService,
          roomStoreService,
          playerStoreService
        )
    )
    .add(
      "playerClientSynchronizationService",
      ({ playerStoreService, roomSessionService, sessionService }) =>
        new PlayerClientSynchronizationService(
          playerStoreService,
          roomSessionService,
          sessionService
        )
    )
    .add("accountService", ({ dao }) => new AccountService(dao))
    .add("logoutService", () => new LogoutService())
    .add(
      "roomSearchService",
      ({ dao, roomStoreService }) =>
        new RoomSearchService(dao, roomStoreService)
    )
    .add(
      "roomObjectRemovalService",
      ({
        roomStoreService,
        objectClientSynchronizationService,
        roomSessionService,
      }) =>
        new RoomObjectRemovalService(
          roomStoreService,
          objectClientSynchronizationService,
          roomSessionService
        )
    )
    .add(
      "roomLeaveService",
      ({ roomObjectRemovalService, playerStoreService, roomStoreService }) =>
        new RoomLeaveService(
          roomObjectRemovalService,
          playerStoreService,
          roomStoreService
        )
    )
    .add(
      "roomCreationService",
      ({ roomService, sequences, roomStoreService }) =>
        new RoomCreationService(roomService, sequences, roomStoreService)
    )
    .add("roomFieldService", () => new RoomFieldService())
    .add(
      "minigameClientSynchronizationService",
      ({ roomSessionService, sessionService }) =>
        new MinigameClientSynchronizationService(
          roomSessionService,
          sessionService
        )
    )
    .add(
      "clickMinigameChallangeHandler",
      () => new ClickMinigameChallangeHandler()
    )
    .add(
      "minigameChallangeService",
      ({ clickMinigameChallangeHandler }) =>
        new MinigameChallangeService([clickMinigameChallangeHandler])
    )
    .add(
      "wardrobeConditionChecker",
      ({ playerStoreService }) =>
        new WardrobeConditionChecker(playerStoreService)
    )
    .add(
      "characterPoseService",
      ({
        playerStoreService,
        roomSessionService,
        sessionService,
        playerClientSynchronizationService,
        characterPoseValidator,
      }) =>
        new CharacterPoseService(
          playerStoreService,
          roomSessionService,
          sessionService,
          playerClientSynchronizationService,
          characterPoseValidator
        )
    )
    .add(
      "wardrobeService",
      ({
        playerStoreService,
        playerClientSynchronizationService,
        wardrobeConditionChecker,
        characterPoseValidator,
        characterPoseService,
      }) =>
        new WardrobeService(
          playerStoreService,
          playerClientSynchronizationService,
          wardrobeConditionChecker,
          characterPoseValidator,
          characterPoseService
        )
    )
    .add(
      "changeWardrobeMinigameStakeHandler",
      ({ wardrobeService }) =>
        new ChangeWardrobeMinigameStakeHandler(wardrobeService)
    )
    .add(
      "minigameStakeService",
      ({ changeWardrobeMinigameStakeHandler }) =>
        new MinigameStakeService([changeWardrobeMinigameStakeHandler])
    )
    .add(
      "minigameService",
      ({
        minigameClientSynchronizationService,
        minigameChallangeService,
        minigameStakeService,
      }) =>
        new MinigameService(
          minigameClientSynchronizationService,
          minigameChallangeService,
          minigameStakeService
        )
    )
    .add(
      "roomUtilsService",
      ({ roomStoreService, playerStoreService, minigameService }) =>
        new RoomUtilsService(
          roomStoreService,
          playerStoreService,
          minigameService
        )
    )
    .add(
      "objectCreationService",
      ({ objectIdProvider }) => new ObjectCreationService(objectIdProvider)
    )
    .add(
      "roomObjectCreationService",
      ({
        roomStoreService,
        roomSessionService,
        objectClientSynchronizationService,
        playerStoreService,
        playerClientSynchronizationService,
      }) =>
        new RoomObjectCreationService(
          roomStoreService,
          roomSessionService,
          objectClientSynchronizationService,
          playerStoreService,
          playerClientSynchronizationService
        )
    )
    .add(
      "roomJoinService",
      ({
        roomStoreService,
        roomFieldService,
        objectCreationService,
        playerStoreService,
        roomObjectCreationService,
        scriptService,
      }) =>
        new RoomJoinService(
          roomStoreService,
          roomFieldService,
          objectCreationService,
          playerStoreService,
          roomObjectCreationService,
          scriptService
        )
    )
    .add(
      "loginService",
      ({ accountService, sessionService, logoutService }) =>
        new LoginService(accountService, sessionService, logoutService)
    )
    .add(
      "playerCreationService",
      ({ playerService, sequences }) =>
        new PlayerCreationService(playerService, sequences)
    )
    .add(
      "accountRegistrationService",
      ({
        accountService,
        sequences,
        playerCreationService,
        dao,
        playerService,
      }) =>
        new AccountRegistrationService(
          accountService,
          sequences,
          playerCreationService,
          dao,
          playerService
        )
    )
    .add("migrationService", ({ dao }) => new MigrationService(dao))
    .add(
      "movementConditionChecker",
      ({ minigameService }) => new MovementConditionChecker(minigameService)
    )
    .add(
      "movementService",
      ({
        motionStorage,
        roomStoreService,
        playerStoreService,
        roomFieldService,
        roomSessionService,
        movementConditionChecker,
      }) =>
        new MovementService(
          motionStorage,
          roomStoreService,
          playerStoreService,
          roomFieldService,
          roomSessionService,
          movementConditionChecker
        )
    )
    .add("chatService", () => new ChatService())
    .add(
      "chatSpeakService",
      ({
        playerStoreService,
        sessionService,
        roomSessionService,
        chatService,
      }) =>
        new ChatSpeakService(
          playerStoreService,
          sessionService,
          roomSessionService,
          chatService
        )
    )
    .add(
      "dialogueOptionService",
      ({
        playerStoreService,
        roomStoreService,
        scriptService,
        chatService,
        sessionService,
      }) =>
        new DialogueOptionService(
          playerStoreService,
          dialogueOptions,
          roomStoreService,
          scriptService,
          chatService,
          sessionService
        )
    )
    .add(
      "roomInitializationService",
      ({
        roomService,
        roomCreationService,
        objectIdProvider,
        objectCreationService,
      }) =>
        new RoomInitializationService(
          roomService,
          roomCreationService,
          objectIdProvider,
          objectCreationService
        )
    )
    .add(
      "roomDatabaseSynchronizationService",
      ({ roomStoreService, roomService }) =>
        new RoomDatabaseSynchronizationService(roomStoreService, roomService)
    )
    .add(
      "databaseSynchronizationService",
      ({
        playerDatabaseSynchronizationService,
        roomDatabaseSynchronizationService,
      }) =>
        new DatabaseSynchronizationService(
          playerDatabaseSynchronizationService,
          roomDatabaseSynchronizationService
        )
    )
    .add("itemIdProvider", ({ sequences }) => new ItemIdProvider(sequences))
    .add(
      "itemService",
      ({
        sessionService,
        playerStoreService,
        roomSessionService,
        playerClientSynchronizationService,
        itemIdProvider,
      }) =>
        new ItemService(
          sessionService,
          playerStoreService,
          roomSessionService,
          playerClientSynchronizationService,
          itemIdProvider
        )
    )
    .add(
      "wardrobeMinigameService",
      ({ minigameService, playerStoreService }) =>
        new WardrobeMinigameService(minigameService, playerStoreService)
    )
    .add(
      "wardrobeChangeService",
      ({
        wardrobeService,
        wardrobeConditionChecker,
        wardrobeMinigameService,
      }) =>
        new WardrobeChangeService(
          wardrobeService,
          wardrobeConditionChecker,
          wardrobeMinigameService
        )
    )
    .add(
      "actionService",
      ({ roomSessionService, chatService, playerStoreService }) =>
        new ActionService([
          new SmileActionHandler(
            roomSessionService,
            chatService,
            playerStoreService
          ),
        ])
    )
    .add(
      "headmistressScript",
      ({
        roomStoreService,
        sessionService,
        chatService,
        playerStoreService,
        itemService,
      }) =>
        new HeadmistressScript(
          roomStoreService,
          sessionService,
          chatService,
          playerStoreService,
          itemService
        )
    )
    .add("scripts", ({ headmistressScript }) => [headmistressScript]);
};
