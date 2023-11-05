import { arePositionsEqual, type Position } from "../common/model/Position";
import { type Player } from "../player/model/Player";
import { roomService, type RoomService } from "../room/RoomService";
import { type Session } from "../session/model/Session";
import { isPlayerObject, type PlayerObject } from "./model/PlayerObject";
import { type World } from "./model/World";
import { WorldObjectType } from "./model/WorldObject";
import {
  worldObjectCreator,
  type WorldObjectCreator,
} from "./WorldObjectCreator";
import {
  worldObjectIdProvider,
  type WorldObjectIdProvider,
} from "./WorldObjectIdProvider";
import {
  worldObjectSynchronizationService,
  type WorldObjectSynchronizationService,
} from "./WorldObjectSynchronizationService";

export class WorldService {
  private worldsByRoomsIds = new Map<number, World>();

  constructor(
    private worldObjectSynchronizationService: WorldObjectSynchronizationService,
    private roomService: RoomService,
    private worldObjectIdProvider: WorldObjectIdProvider,
    private worldObjectCreator: WorldObjectCreator
  ) {}

  async getWorldByRoomId(roomId: number): Promise<World> {
    const existingWorld = this.worldsByRoomsIds.get(roomId);
    if (existingWorld != null) {
      return existingWorld;
    }

    const room = await this.roomService.getRoomById(roomId);
    if (room == null) {
      throw new Error("Room does not exist");
    }
    const newWorld: World = {
      roomId,
      objects: this.worldObjectCreator.createObjectsInRoom(room),
    };
    this.worldsByRoomsIds.set(roomId, newWorld);

    return newWorld;
  }

  addPlayer(world: World, player: Player, session: Session): PlayerObject {
    const newPlayerObject: PlayerObject = {
      type: WorldObjectType.Player,
      id: this.worldObjectIdProvider.getNextId(),
      player,
      session,
      position: player.position,
    };
    world.objects.push(newPlayerObject);

    const sessions = world.objects
      .filter(isPlayerObject)
      .filter((playerObject) => playerObject.id !== newPlayerObject.id)
      .map((playerObject) => playerObject.session);

    this.worldObjectSynchronizationService.synchronizeObjects(
      { objects: [newPlayerObject] },
      sessions
    );

    return newPlayerObject;
  }

  removeObject(world: World, objectId: number): void {
    const objectToRemove = world.objects.find(
      (object) => object.id === objectId
    );
    if (objectToRemove == null) {
      return;
    }

    if (isPlayerObject(objectToRemove)) {
      clearTimeout(objectToRemove.motionEndEvent);
      objectToRemove.motionEndEvent = undefined;
    }
    world.objects = world.objects.filter((object) => object.id !== objectId);
    const sessions = this.getSessionsFromWorld(world);
    this.worldObjectSynchronizationService.synchronizeObjects(
      { toRemove: [objectId] },
      sessions
    );
  }

  getSessionsFromWorld(world: World): Session[] {
    return world.objects
      .filter(isPlayerObject)
      .map((playerObject) => playerObject.session);
  }

  isFieldFree(world: World, position: Position): boolean {
    for (const object of world.objects) {
      if (arePositionsEqual(object.position, position)) {
        return false;
      }
    }
    return true;
  }
}

export const worldService = new WorldService(
  worldObjectSynchronizationService,
  roomService,
  worldObjectIdProvider,
  worldObjectCreator
);
