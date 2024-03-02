import { GameObject } from "../model/game-object";
import { NPCObject, isNPCObject } from "../model/npc-object";
import { PlayerObject, isPlayerObject } from "../model/player-object";
import { Room } from "../model/room";

export class RoomUtils {
  static getNPCObject(room: Room, objectId: number): NPCObject {
    const npcObject = RoomUtils.getObjectById(room, objectId);
    if (!isNPCObject(npcObject)) {
      throw new Error(`Object ${objectId} is not an NPC`);
    }

    return npcObject;
  }

  static getPlayerObjectById(room: Room, objectId: number): PlayerObject {
    const playerObject = RoomUtils.getObjectById(room, objectId);
    if (!isPlayerObject(playerObject)) {
      throw new Error(
        `Object ${objectId} is not a player object in room ${room.id}`,
      );
    }
    return playerObject;
  }

  static getPlayerObjectByPlayerId(room: Room, playerId: number): PlayerObject {
    const playerObject = room.objects
      .filter(isPlayerObject)
      .find((object) => object.playerId === playerId);
    if (!playerObject) {
      throw new Error(`Player ${playerId} is not in room ${room.id}`);
    }
    return playerObject;
  }

  static getObjectById(room: Room, objectId: number): GameObject {
    const object = room.objects.find((object) => object.id === objectId);
    if (!object) {
      throw new Error(
        `Object with id ${objectId} not found in room ${room.id}`,
      );
    }
    return object;
  }
}
