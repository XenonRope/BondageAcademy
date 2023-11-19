import { GameObject, Room } from "@bondage-academy/bondage-academy-model";

export class ObjectCreator {
  createObjectsFromRoom(room: Room): GameObject[] {
    return JSON.parse(JSON.stringify(room.objects ?? []));
  }
}
