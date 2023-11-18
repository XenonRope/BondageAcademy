import { type PlayerStoreService } from "../player/PlayerStoreService";
import { type Session } from "../session/model/Session";
import {
  isBlockObject,
  type BlockObject,
  type BlockObjectForClient,
} from "./model/BlockObject";
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
  constructor(private playerStoreService: PlayerStoreService) {}

  async synchronizeObjects(
    params: { objects?: WorldObject[]; toRemove?: number[] },
    sessions: Session[]
  ): Promise<void> {
    const objectsForClient = await this.mapToObjectsForClient(
      params.objects ?? []
    );
    for (const session of sessions) {
      session.socket.emit("synchronize_world_objects", {
        objects: objectsForClient,
        toRemove: params.toRemove,
      });
    }
  }

  async mapToObjectsForClient(
    objects: WorldObject[]
  ): Promise<WorldObjectForClient[]> {
    const result: WorldObjectForClient[] = [];
    for (const object of objects) {
      const mappedObject = await this.mapToObjectForClient(object);
      if (mappedObject != null) {
        result.push(mappedObject);
      }
    }
    return result;
  }

  private async mapToObjectForClient(
    object: WorldObject
  ): Promise<WorldObjectForClient | undefined> {
    if (isPlayerObject(object)) {
      return await this.mapToPlayerForClient(object);
    }
    if (isBlockObject(object)) {
      return this.mapToBlockForClient(object);
    }
    return undefined;
  }

  private async mapToPlayerForClient(
    object: PlayerObject
  ): Promise<PlayerObjectForClient> {
    const player = await this.playerStoreService.get(object.playerId);
    return {
      type: WorldObjectType.Player,
      id: object.id,
      playerId: object.playerId,
      name: player.name,
      position: object.position,
      character: player.character,
    };
  }

  private mapToBlockForClient(object: BlockObject): BlockObjectForClient {
    return {
      type: WorldObjectType.Block,
      id: object.id,
      position: object.position,
      color: object.color,
    };
  }
}
