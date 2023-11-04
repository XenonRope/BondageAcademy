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
  synchronizeObjects(objects: WorldObject[], sessions: Session[]): void {
    const objectsForClient = objects
      .map((object) => this.mapToObjectForClient(object))
      .filter((object) => object != null);
    for (const session of sessions) {
      session.socket.emit("synchronize_world_objects", {
        objects: objectsForClient,
      });
    }
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
