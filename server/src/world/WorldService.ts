import { type Player } from "../player/model/Player";
import { type Session } from "../session/model/Session";
import { isPlayerObject, type PlayerObject } from "./model/PlayerObject";
import { type World } from "./model/World";
import { WorldObjectType } from "./model/WorldObject";
import { worldObjectSynchronizationService } from "./WorldObjectSynchronizationService";

export class WorldService {
  private worldsByRoomsIds = new Map<number, World>();
  private nextObjectId = 1;

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

    worldObjectSynchronizationService.synchronizeObjects(
      [newPlayerObject],
      sessions
    );

    return newPlayerObject;
  }
}

export const worldService = new WorldService();
