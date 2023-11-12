import { BusinessError } from "../common/model/BusinessError";
import { type Position } from "../common/model/Position";
import { roomService, type RoomService } from "../room/RoomService";
import { type Room } from "../room/model/Room";
import { type Session } from "../session/model/Session";
import {
  worldObjectIdProvider,
  type WorldObjectIdProvider,
} from "./WorldObjectIdProvider";
import {
  worldObjectSynchronizationService,
  type WorldObjectSynchronizationService,
} from "./WorldObjectSynchronizationService";
import { worldService, type WorldService } from "./WorldService";
import { isPlayerObject, type PlayerObject } from "./model/PlayerObject";
import { type World } from "./model/World";
import { WorldObjectType } from "./model/WorldObject";

export class WorldJoinService {
  constructor(
    private worldService: WorldService,
    private worldObjectIdProvider: WorldObjectIdProvider,
    private worldObjectSynchronizationService: WorldObjectSynchronizationService,
    private roomService: RoomService
  ) {}

  joinWorldById(
    session: Session,
    worldId: number
  ): { world: World; playerObject: PlayerObject } | BusinessError {
    const world = this.worldService.getWorldById(worldId);
    if (world == null) {
      return new BusinessError("worldNotFound");
    }
    if (world.restrictions.singlePlayer) {
      return new BusinessError("cannotJoinSinglePlayerWorld");
    }

    return this.joinWorld(session, world);
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
        return this.joinWorld(session, world);
      }
    }

    const newWorld = await this.worldService.createWorld(room);
    return this.joinWorld(session, newWorld);
  }

  private joinWorld(
    session: Session,
    world: World
  ): { world: World; playerObject: PlayerObject } | BusinessError {
    if (session.playerId == null) {
      throw new Error("No player in session");
    }
    const position = this.findFreePositionInTransitArea(world);
    if (position == null) {
      return new BusinessError("noFreePositionInTransitArea");
    }
    const newPlayerObject: PlayerObject = {
      type: WorldObjectType.Player,
      id: this.worldObjectIdProvider.getNextId(),
      playerId: session.playerId,
      session,
      position,
    };
    world.objects.push(newPlayerObject);

    if (session.world && session.playerObject) {
      this.worldService.removeObject(session.world, session.playerObject.id);
    }

    const sessions = world.objects
      .filter(isPlayerObject)
      .filter((playerObject) => playerObject.id !== newPlayerObject.id)
      .map((playerObject) => playerObject.session);

    this.worldObjectSynchronizationService.synchronizeObjects(
      { objects: [newPlayerObject] },
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

export const worldJoinService = new WorldJoinService(
  worldService,
  worldObjectIdProvider,
  worldObjectSynchronizationService,
  roomService
);
