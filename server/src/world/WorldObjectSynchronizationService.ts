import { type Session } from "../session/model/Session";
import {
  isPlayerObject,
  type PlayerObject,
  type PlayerObjectForClient,
} from "./model/PlayerObject";
import {
  WorldObjectType,
  type WorldObject,
  type WorldObjectForClient,
} from "./model/WorldObject";

export class WorldObjectSynchronizationService {
  synchronizeObjects(
    params: { objects?: WorldObject[]; toRemove?: number[] },
    sessions: Session[]
  ): void {
    const objectsForClient = this.mapToObjectsForClient(params.objects ?? []);
    for (const session of sessions) {
      session.socket.emit("synchronize_world_objects", {
        objects: objectsForClient,
        toRemove: params.toRemove,
      });
    }
  }

  mapToObjectsForClient(objects: WorldObject[]): WorldObjectForClient[] {
    return objects
      .map((object) => this.mapToObjectForClient(object))
      .filter((object): object is WorldObject => object != null);
  }

  private mapToObjectForClient(
    object: WorldObject
  ): WorldObjectForClient | undefined {
    if (isPlayerObject(object)) {
      return this.mapToPlayerForClient(object);
    }
    return undefined;
  }

  private mapToPlayerForClient(object: PlayerObject): PlayerObjectForClient {
    return {
      type: WorldObjectType.Player,
      id: object.id,
      playerId: object.player.id,
      name: object.player.name,
      position: object.position,
    };
  }
}

export const worldObjectSynchronizationService =
  new WorldObjectSynchronizationService();
