import {
  Room,
  RoomSearchDetails,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { Collection, Filter } from "mongodb";
import { inject, singleton } from "tsyringe";
import { Dao } from "../dao/dao";
import { CollectionName } from "../dao/model/collection-name";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomSearchService {
  private collection!: Collection<Room>;

  constructor(
    @inject(Dao) dao: Dao,
    @inject(RoomStoreService) private roomStoreService: RoomStoreService,
  ) {
    this.collection = dao.getCollection(CollectionName.ROOMS);
  }

  async searchRooms(params: {
    name?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ rooms: RoomSearchDetails[]; totalCount: number }> {
    const filter: Filter<Room> = {
      template: false,
      "restrictions.players": null,
    };
    if (params.name) {
      filter.customName = new RegExp(this.escapeRegExp(params.name));
    }
    const totalCount = await this.collection.countDocuments(filter);
    const rooms = (
      await this.collection
        .find(filter, {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            customName: 1,
            description: 1,
            "objects.type": 1,
          },
        })
        .skip(params.skip ?? 0)
        .limit(params.limit ?? 20)
        .toArray()
    ).map(this.mapRoomToRoomSearchDetails.bind(this));

    return { rooms, totalCount };
  }

  private mapRoomToRoomSearchDetails(room: Room): RoomSearchDetails {
    const roomToMap = this.roomStoreService.getIfExists(room.id) ?? room;
    return {
      id: room.id,
      name: room.name,
      customName: room.customName,
      description: room.description,
      playersCount: roomToMap.objects.filter(isPlayerObject).length,
    };
  }

  private escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
