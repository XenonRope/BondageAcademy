import {
  ObjectType,
  PlayerObject,
  Position,
  Room,
  World,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { BusinessError } from "../api/model/business-error";
import { ObjectSynchronizationService } from "../object/object-client-synchronization-service";
import { ObjectIdProvider } from "../object/object-id-provider";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomService } from "../room/room-service";
import type { Session } from "../session/model/session";
import type { SessionService } from "../session/session-service";
import { type WorldService } from "./world-service";

export class WorldJoinService {
  constructor(
    private worldService: WorldService,
    private worldObjectIdProvider: ObjectIdProvider,
    private objectSynchronizationService: ObjectSynchronizationService,
    private roomService: RoomService,
    private playerStoreService: PlayerStoreService,
    private sessionService: SessionService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService
  ) {}

  async joinWorldById(
    session: Session,
    worldId: number
  ): Promise<{ world: World; playerObject: PlayerObject } | BusinessError> {
    const world = this.worldService.getWorldById(worldId);
    if (world == null) {
      return new BusinessError("worldNotFound");
    }
    if (world.restrictions.singlePlayer) {
      return new BusinessError("cannotJoinSinglePlayerWorld");
    }

    return await this.joinWorld(session, world);
  }

  async joinWorldByRoomId(
    session: Session,
    roomId: number
  ): Promise<{ world: World; playerObject: PlayerObject } | BusinessError> {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new Error("Cannot find room with id " + roomId);
    }

    return await this.joinRoom(session, room);
  }

  async joinWorldByRoomCode(
    session: Session,
    roomCode: string
  ): Promise<{ world: World; playerObject: PlayerObject } | BusinessError> {
    const room = await this.roomService.getRoomByCode(roomCode);
    if (!room) {
      throw new Error("Cannot find room with code " + roomCode);
    }

    return await this.joinRoom(session, room);
  }

  async joinRoom(
    session: Session,
    room: Room
  ): Promise<{ world: World; playerObject: PlayerObject } | BusinessError> {
    if (room.persistent) {
      const world = this.worldService.getWorldByRoomId(room.id);
      if (world) {
        return await this.joinWorld(session, world);
      }
    }

    const newWorld = await this.worldService.createWorld(room);
    return await this.joinWorld(session, newWorld);
  }

  private async joinWorld(
    session: Session,
    world: World
  ): Promise<{ world: World; playerObject: PlayerObject } | BusinessError> {
    if (session.playerId == null) {
      throw new Error("No player in session");
    }
    const position = this.findFreePositionInTransitArea(world);
    if (position == null) {
      return new BusinessError("noFreePositionInTransitArea");
    }
    const newPlayerObject: PlayerObject = {
      type: ObjectType.Player,
      id: await this.worldObjectIdProvider.getNextId(),
      position,
      playerId: session.playerId,
    };
    world.objects.push(newPlayerObject);

    if (session.world && session.playerObject) {
      this.worldService.removeObject(session.world, session.playerObject.id);
    }

    const sessions = world.objects
      .filter(isPlayerObject)
      .filter((playerObject) => playerObject.id !== newPlayerObject.id)
      .map((playerObject) =>
        this.sessionService.getSessionByPlayerId(playerObject.playerId)
      )
      .flatMap((session) => (session ? [session] : []));

    await this.playerStoreService.update(session.playerId, (player) => {
      player.worldId = world.id;
      player.roomId = world.roomId;
    });
    this.objectSynchronizationService.synchronizeObjects(
      { objects: [newPlayerObject] },
      sessions
    );
    const player = await this.playerStoreService.get(session.playerId);
    this.playerClientSynchronizationService.synchronizePlayers(
      [player],
      sessions
    );

    return { world, playerObject: newPlayerObject };
  }

  private findFreePositionInTransitArea(world: World): Position | undefined {
    for (const transitArea of world.transitAreas) {
      for (let x = transitArea.x; x < transitArea.x + transitArea.width; x++) {
        for (
          let y = transitArea.y;
          y < transitArea.y + transitArea.height;
          y++
        ) {
          if (this.worldService.isFieldFree(world, { x, y })) {
            return { x, y };
          }
        }
      }
    }

    return undefined;
  }
}
