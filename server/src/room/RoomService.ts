import { type Collection } from "mongodb";
import { dao, type Dao } from "../common/Dao";
import { CollectionName } from "../common/model/CollectionName";
import { type Room } from "./model/Room";

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

export const roomService = new RoomService(dao);
