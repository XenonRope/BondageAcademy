import {
  Room,
  RoomSearchDetails,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { Collection, Filter } from "mongodb";
import { Dao } from "../dao/dao";
import { CollectionName } from "../dao/model/collection-name";

export class RoomSearchService {
  private collection!: Collection<Room>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.ROOMS);
  }

  async searchRooms(params: { name?: string }): Promise<RoomSearchDetails[]> {
    const filter: Filter<Room> = {
      template: false,
      "restrictions.players": null,
    };
    if (params.name) {
      filter.name = new RegExp(this.escapeRegExp(params.name));
    }
    return (
      await this.collection
        .find(filter, {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            customName: 1,
            "objects.type": 1,
          },
        })
        .toArray()
    ).map(this.mapRoomToRoomSearchDetails.bind(this));
  }

  private mapRoomToRoomSearchDetails(room: Room): RoomSearchDetails {
    return {
      id: room.id,
      name: room.name,
      customName: room.customName,
      playersCount: room.objects.filter(isPlayerObject).length,
    };
  }

  private escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
