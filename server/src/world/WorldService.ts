import { arePositionsEqual, type Position } from "../common/model/Position";
import { type Room } from "../room/model/Room";
import { type Session } from "../session/model/Session";
import { isPlayerObject } from "./model/PlayerObject";
import { type World } from "./model/World";
import {
  worldCreationService,
  type WorldCreationService,
} from "./WorldCreationService";
import {
  worldObjectSynchronizationService,
  type WorldObjectSynchronizationService,
} from "./WorldObjectSynchronizationService";

export class WorldService {
  private worlds: World[] = [];

  constructor(
    private worldObjectSynchronizationService: WorldObjectSynchronizationService,
    private worldCreationService: WorldCreationService
  ) {}

  getWorldById(worldId: number): World | undefined {
    return this.worlds.find((world) => world.id === worldId);
  }

  getWorldByRoomId(roomId: number): World | undefined {
    return this.worlds.find((world) => world.roomId === roomId);
  }

  async createWorld(room: Room): Promise<World> {
    const wolrd = await this.worldCreationService.createWorld(room);
    this.worlds.push(wolrd);

    return wolrd;
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
  worldCreationService
);
