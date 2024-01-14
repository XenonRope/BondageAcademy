import { NPCObject, isNPCObject } from "../model/npc-object";
import { Room } from "../model/room";

export class RoomUtils {
  static getNPCObject(room: Room, objectId: number): NPCObject {
    const npcObject = room.objects.find((object) => object.id === objectId);
    if (!npcObject) {
      throw new Error(
        `Object with id ${objectId} not found in room ${room.id}`
      );
    }
    if (!isNPCObject(npcObject)) {
      throw new Error(`Object ${objectId} is not an NPC`);
    }

    return npcObject;
  }
}
