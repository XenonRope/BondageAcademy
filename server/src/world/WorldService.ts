import { type Player } from "../player/model/Player";
import { type Session } from "../session/model/Session";
import { isPlayerObject, type PlayerObject } from "./model/PlayerObject";
import { type World } from "./model/World";
import { WorldObjectType } from "./model/WorldObject";
import {
  worldObjectSynchronizationService,
  type WorldObjectSynchronizationService,
} from "./WorldObjectSynchronizationService";

export class WorldService {
  private worldsByRoomsIds = new Map<number, World>();
  private nextObjectId = 1;

  constructor(
    private worldObjectSynchronizationService: WorldObjectSynchronizationService
  ) {}

  async getWorldByRoomId(roomId: number): Promise<World> {
    const existingWorld = this.worldsByRoomsIds.get(roomId);
    if (existingWorld != null) {
      return existingWorld;
    }

    const newWorld: World = {
      roomId,
      objects: [],
    };
    this.worldsByRoomsIds.set(roomId, newWorld);

    return newWorld;
  }

  addPlayer(world: World, player: Player, session: Session): PlayerObject {
    const newPlayerObject: PlayerObject = {
      type: WorldObjectType.Player,
      id: this.nextObjectId++,
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
    world.objects = world.objects.filter((object) => object.id !== objectId);
    const sessions = world.objects
      .filter(isPlayerObject)
      .map((playerObject) => playerObject.session);
    this.worldObjectSynchronizationService.synchronizeObjects(
      { toRemove: [objectId] },
      sessions
    );
  }
}

export const worldService = new WorldService(worldObjectSynchronizationService);
