import { AccountRegistrationService } from "../account/AccountRegistrationService";
import { AccountService } from "../account/AccountService";
import { LoginService } from "../account/LoginService";
import { LogoutService } from "../account/LogoutService";
import { CharacterPoseService } from "../character/CharacterPoseService";
import { Dao } from "../common/Dao";
import { Sequences } from "../common/Sequences";
import { MigrationService } from "../migration/MigrationService";
import { MovementService } from "../movement/MovementService";
import { PlayerCreationService } from "../player/PlayerCreationService";
import { PlayerService } from "../player/PlayerService";
import { PlayerStoreService } from "../player/PlayerStoreService";
import { RoomCreationService } from "../room/RoomCreationService";
import { RoomInitializationService } from "../room/RoomInitializationService";
import { RoomService } from "../room/RoomService";
import { SessionService } from "../session/SessionService";
import { PlayerSynchronizationService } from "../synchronization/PlayerSynchronizationService";
import { SynchronizationService } from "../synchronization/SynchronizationService";
import { WorldCreationService } from "../world/WorldCreationService";
import { WorldJoinService } from "../world/WorldJoinService";
import { WorldObjectCreator } from "../world/WorldObjectCreator";
import { WorldObjectIdProvider } from "../world/WorldObjectIdProvider";
import { WorldObjectSynchronizationService } from "../world/WorldObjectSynchronizationService";
import { WorldService } from "../world/WorldService";

export const dao = new Dao();

export const sequences = new Sequences(dao);

export const worldObjectIdProvider = new WorldObjectIdProvider();

export const worldObjectCreator = new WorldObjectCreator(worldObjectIdProvider);

export const worldCreationService = new WorldCreationService(
  sequences,
  worldObjectCreator
);

export const playerService = new PlayerService(dao);

export const playerStoreService = new PlayerStoreService(playerService);

export const worldObjectSynchronizationService =
  new WorldObjectSynchronizationService(playerStoreService);

export const worldService = new WorldService(
  worldObjectSynchronizationService,
  worldCreationService
);

export const roomService = new RoomService(dao);

export const worldJoinService = new WorldJoinService(
  worldService,
  worldObjectIdProvider,
  worldObjectSynchronizationService,
  roomService,
  playerStoreService
);

export const accountService = new AccountService(dao);

export const logoutService = new LogoutService(worldService);

export const sessionService = new SessionService();

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

export const movementService = new MovementService(worldService);

export const roomCreationService = new RoomCreationService(
  roomService,
  sequences
);

export const roomInitializationService = new RoomInitializationService(
  roomService,
  roomCreationService
);

export const playerSynchronizationService = new PlayerSynchronizationService(
  playerStoreService,
  playerService
);

export const synchronizationService = new SynchronizationService(
  playerSynchronizationService
);
