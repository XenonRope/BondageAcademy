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
import { ObjectSynchronizationService as ObjectClientSynchronizationService } from "../object/object-client-synchronization-service";
import { ObjectCreator } from "../object/object-creator";
import { ObjectIdProvider } from "../object/object-id-provider";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerCreationService } from "../player/player-creation-service";
import { PlayerService } from "../player/player-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomCreationService } from "../room/room-creation-service";
import { RoomInitializationService } from "../room/room-initialization-service";
import { RoomService } from "../room/room-service";
import { SessionService } from "../session/session-service";
import { PlayerSynchronizationService } from "../synchronization/player-synchronization-service";
import { SynchronizationService } from "../synchronization/synchronization-service";
import { WorldCreationService } from "../world/world-creation-service";
import { WorldJoinService } from "../world/world-join-service";
import { WorldService } from "../world/world-service";

export const dao = new Dao();

export const sequences = new Sequences(dao);

export const objectIdProvider = new ObjectIdProvider(sequences);

export const objectCreator = new ObjectCreator();

export const worldCreationService = new WorldCreationService(
  sequences,
  objectCreator
);

export const playerService = new PlayerService(dao);

export const playerStoreService = new PlayerStoreService(playerService);

export const objectClientSynchronizationService =
  new ObjectClientSynchronizationService();

export const motionStorage = new MotionStorage();

export const sessionService = new SessionService();

export const worldService = new WorldService(
  objectClientSynchronizationService,
  worldCreationService,
  motionStorage,
  sessionService
);

export const roomService = new RoomService(dao);

export const playerSynchronizationService = new PlayerSynchronizationService(
  playerStoreService,
  playerService
);

export const playerClientSynchronizationService =
  new PlayerClientSynchronizationService();

export const worldJoinService = new WorldJoinService(
  worldService,
  objectIdProvider,
  objectClientSynchronizationService,
  roomService,
  playerStoreService,
  sessionService,
  playerClientSynchronizationService
);

export const accountService = new AccountService(dao);

export const logoutService = new LogoutService(worldService);

export const loginService = new LoginService(
  accountService,
  playerStoreService,
  sessionService,
  logoutService,
  worldJoinService
);

export const playerCreationService = new PlayerCreationService(
  playerService,
  roomService,
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
  worldService,
  playerStoreService
);

export const migrationService = new MigrationService(dao);

export const movementService = new MovementService(worldService, motionStorage);

export const roomCreationService = new RoomCreationService(
  roomService,
  sequences
);

export const roomInitializationService = new RoomInitializationService(
  roomService,
  roomCreationService,
  objectIdProvider
);

export const synchronizationService = new SynchronizationService(
  playerSynchronizationService
);
