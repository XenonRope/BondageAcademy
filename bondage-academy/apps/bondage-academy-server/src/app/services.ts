import { AccountRegistrationService } from "../account/account-registration-service";
import { AccountService } from "../account/account-service";
import { LoginService } from "../account/login-service";
import { LogoutService } from "../account/logout-service";
import { CharacterPoseService } from "../character/character-pose-service";
import { Dao } from "../dao/dao";
import { Sequences } from "../dao/sequences";
import { MigrationService } from "../migration/migration-service";
import { MotionStorage } from "../movement/motion-storage";
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
import { RoomService } from "../room/room-service";
import { RoomSessionService } from "../room/room-session-service";
import { RoomStoreService } from "../room/room-store-service";
import { RoomUtilsService } from "../room/room-utils-service";
import { SessionService } from "../session/session-service";
import { DatabaseSynchronizationService } from "../synchronization/database-synchronization-service";
export const dao = new Dao();

export const sequences = new Sequences(dao);

export const objectIdProvider = new ObjectIdProvider(sequences);

export const playerService = new PlayerService(dao);

export const playerStoreService = new PlayerStoreService(playerService);

export const objectClientSynchronizationService =
  new ObjectClientSynchronizationService();

export const motionStorage = new MotionStorage();

export const sessionService = new SessionService();

export const roomService = new RoomService(dao);

export const playerDatabaseSynchronizationService =
  new PlayerDatabaseSynchronizationService(playerStoreService, playerService);

export const playerClientSynchronizationService =
  new PlayerClientSynchronizationService();

export const accountService = new AccountService(dao);

export const logoutService = new LogoutService();

export const roomStoreService = new RoomStoreService(roomService);

export const roomSessionService = new RoomSessionService(
  sessionService,
  roomStoreService
);

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

export const roomUtilsService = new RoomUtilsService(
  roomStoreService,
  playerStoreService
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
  roomObjectCreationService
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
  sessionService
);

export const migrationService = new MigrationService(dao);

export const movementService = new MovementService(
  motionStorage,
  roomStoreService,
  playerStoreService,
  roomFieldService,
  roomSessionService
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
