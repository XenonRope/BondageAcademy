import { dialogueOptions } from "@bondage-academy/bondage-academy-model";
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
import { GameScript } from "../script/scripts/game-script";
import { HeadmistressScript } from "../script/scripts/headmistress-script";
import { SessionService } from "../session/session-service";
import { DatabaseSynchronizationService } from "../synchronization/database-synchronization-service";
import { WardrobeChangeService } from "../wardrobe/wardrobe-change-service";
import { WardrobeConditionChecker } from "../wardrobe/wardrobe-condition-checker";
import { WardrobeService } from "../wardrobe/wardrobe-service";
export const dao = new Dao();

export const sequences = new Sequences(dao);

export const objectIdProvider = new ObjectIdProvider(sequences);

export const playerService = new PlayerService(dao);

export const playerStoreService = new PlayerStoreService(playerService);

export const scriptService = new ScriptService();

export const objectClientSynchronizationService =
  new ObjectClientSynchronizationService();

export const motionStorage = new MotionStorage();

export const sessionService = new SessionService();

export const roomService = new RoomService(dao);

export const playerDatabaseSynchronizationService =
  new PlayerDatabaseSynchronizationService(playerStoreService, playerService);

export const roomStoreService = new RoomStoreService(roomService);

export const roomSessionService = new RoomSessionService(
  sessionService,
  roomStoreService,
  playerStoreService
);

export const playerClientSynchronizationService =
  new PlayerClientSynchronizationService(
    playerStoreService,
    roomSessionService,
    sessionService
  );

export const accountService = new AccountService(dao);

export const logoutService = new LogoutService();

export const roomSearchService = new RoomSearchService(dao, roomStoreService);

export const roomObjectRemovalService = new RoomObjectRemovalService(
  roomStoreService,
  objectClientSynchronizationService,
  roomSessionService
);

export const roomLeaveService = new RoomLeaveService(
  roomObjectRemovalService,
  playerStoreService,
  roomStoreService
);

export const roomCreationService = new RoomCreationService(
  roomService,
  sequences,
  roomStoreService
);

export const roomFieldService = new RoomFieldService();

export const minigameClientSynchronizationService =
  new MinigameClientSynchronizationService(roomSessionService, sessionService);

export const clickMinigameChallangeHandler =
  new ClickMinigameChallangeHandler();

export const minigameChallangeService = new MinigameChallangeService([
  clickMinigameChallangeHandler,
]);

export const wardrobeConditionChecker = new WardrobeConditionChecker(
  playerStoreService
);

export const wardrobeService = new WardrobeService(
  playerStoreService,
  playerClientSynchronizationService,
  wardrobeConditionChecker
);

export const changeWardrobeMinigameStakeHandler =
  new ChangeWardrobeMinigameStakeHandler(wardrobeService);

export const minigameStakeService = new MinigameStakeService([
  changeWardrobeMinigameStakeHandler,
]);

export const minigameService = new MinigameService(
  minigameClientSynchronizationService,
  minigameChallangeService,
  minigameStakeService
);

export const roomUtilsService = new RoomUtilsService(
  roomStoreService,
  playerStoreService,
  minigameService
);

export const objectCreationService = new ObjectCreationService(
  objectIdProvider
);

export const roomObjectCreationService = new RoomObjectCreationService(
  roomStoreService,
  roomSessionService,
  objectClientSynchronizationService,
  playerStoreService,
  playerClientSynchronizationService
);

export const roomJoinService = new RoomJoinService(
  roomStoreService,
  roomFieldService,
  objectCreationService,
  playerStoreService,
  roomObjectCreationService,
  scriptService
);

export const loginService = new LoginService(
  accountService,
  sessionService,
  logoutService
);

export const playerCreationService = new PlayerCreationService(
  playerService,
  sequences
);

export const accountRegistrationService = new AccountRegistrationService(
  accountService,
  sequences,
  playerCreationService,
  dao,
  playerService
);

export const characterPoseService = new CharacterPoseService(
  playerStoreService,
  roomSessionService,
  sessionService,
  playerClientSynchronizationService
);

export const migrationService = new MigrationService(dao);

export const movementConditionChecker = new MovementConditionChecker(
  minigameService
);

export const movementService = new MovementService(
  motionStorage,
  roomStoreService,
  playerStoreService,
  roomFieldService,
  roomSessionService,
  movementConditionChecker
);

export const chatService = new ChatService();

export const chatSpeakService = new ChatSpeakService(
  playerStoreService,
  sessionService,
  roomSessionService,
  chatService
);

export const dialogueOptionService = new DialogueOptionService(
  playerStoreService,
  dialogueOptions,
  roomStoreService,
  scriptService,
  chatService,
  sessionService
);

export const roomInitializationService = new RoomInitializationService(
  roomService,
  roomCreationService,
  objectIdProvider,
  objectCreationService
);

export const roomDatabaseSynchronizationService =
  new RoomDatabaseSynchronizationService(roomStoreService, roomService);

export const databaseSynchronizationService =
  new DatabaseSynchronizationService(
    playerDatabaseSynchronizationService,
    roomDatabaseSynchronizationService
  );

export const itemIdProvider = new ItemIdProvider(sequences);

export const itemService = new ItemService(
  sessionService,
  playerStoreService,
  roomSessionService,
  playerClientSynchronizationService,
  itemIdProvider
);

export const wardrobeMinigameService = new WardrobeMinigameService(
  minigameService,
  playerStoreService
);

export const wardrobeChangeServiec = new WardrobeChangeService(
  wardrobeService,
  wardrobeConditionChecker,
  wardrobeMinigameService
);

export const actionService = new ActionService([
  new SmileActionHandler(roomSessionService, chatService, playerStoreService),
]);

export const headmistressScript = new HeadmistressScript(
  roomStoreService,
  sessionService,
  chatService,
  playerStoreService,
  itemService
);

export const scripts: GameScript[] = [headmistressScript];
