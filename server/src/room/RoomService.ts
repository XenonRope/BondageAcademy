import { type Collection } from "mongodb";
import type { Room } from "shared";
import { type Dao } from "../common/Dao";
import { CollectionName } from "../common/model/CollectionName";

export class RoomService {
  private collection!: Collection<Room>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.ROOMS);
  }

  async insertRoom(room: Room): Promise<void> {
    await this.collection.insertOne(room);
  }

  async getRoomById(id: number): Promise<Room | null> {
    return await this.collection.findOne({ id });
  }

  async getRoomByCode(code: string): Promise<Room | null> {
    return await this.collection.findOne({ code });
  }

  async getRoomIdByCode(code: string): Promise<number | undefined> {
    const room = await this.collection.findOne(
      { code },
      { projection: { _id: 0, id: 1 } }
    );
    return room?.id;
  }
}
