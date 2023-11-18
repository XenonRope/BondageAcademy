import type { GameObject, Room } from "shared";

export class ObjectCreator {
  createObjectsFromRoom(room: Room): GameObject[] {
    return JSON.parse(JSON.stringify(room.objects ?? []));
  }
}
