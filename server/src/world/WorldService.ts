import { isPlayerObject, type Room, type World } from "shared";
import { arePositionsEqual, type Position } from "../common/model/Position";
import type { MotionStorage } from "../movement/MotionStorage";
import { type ObjectSynchronizationService } from "../object/ObjectSynchronizationService";
import { type Session } from "../session/model/Session";
import type { SessionService } from "../session/SessionService";
import { type WorldCreationService } from "./WorldCreationService";

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
    const wolrd = await this.worldCreationService.createWorld(room);
    this.worlds.push(wolrd);

    return wolrd;
  }

  async removeObject(world: World, objectId: number): Promise<void> {
    const objectToRemove = world.objects.find(
      (object) => object.id === objectId
    );
    if (objectToRemove == null) {
      return;
    }

    this.motionStorage.stopMotion(objectToRemove.id);
    world.objects = world.objects.filter((object) => object.id !== objectId);
    const sessions = this.getSessionsFromWorld(world);
    await this.worldObjectSynchronizationService.synchronizeObjects(
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
