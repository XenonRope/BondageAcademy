import {
  Position,
  Room,
  World,
  arePositionsEqual,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { MotionStorage } from "../movement/motion-storage";
import { ObjectSynchronizationService } from "../object/object-client-synchronization-service";
import { type Session } from "../session/model/session";
import type { SessionService } from "../session/session-service";
import { type WorldCreationService } from "./world-creation-service";

export class WorldService {
  private worlds: World[] = [];

  constructor(
    private worldObjectSynchronizationService: ObjectSynchronizationService,
    private worldCreationService: WorldCreationService,
    private motionStorage: MotionStorage,
    private sessionService: SessionService
  ) {}

  getWorldById(worldId: number): World | undefined {
    return this.worlds.find((world) => world.id === worldId);
  }

  getWorldByRoomId(roomId: number): World | undefined {
    return this.worlds.find((world) => world.roomId === roomId);
  }

  async createWorld(room: Room): Promise<World> {
    const world = await this.worldCreationService.createWorld(room);
    this.worlds.push(world);

    return world;
  }

  removeObject(world: World, objectId: number): void {
    const objectToRemove = world.objects.find(
      (object) => object.id === objectId
    );
    if (objectToRemove == null) {
      return;
    }

    this.motionStorage.stopMotion(objectToRemove.id);
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
      .map((playerObject) =>
        this.sessionService.getSessionByPlayerId(playerObject.playerId)
      )
      .flatMap((session) => (session ? [session] : []));
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
