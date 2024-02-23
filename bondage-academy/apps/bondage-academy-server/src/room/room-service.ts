import { Room } from "@bondage-academy/bondage-academy-model";
import { Collection } from "mongodb";
import { inject, singleton } from "tsyringe";
import { Dao } from "../dao/dao";
import { CollectionName } from "../dao/model/collection-name";

@singleton()
export class RoomService {
  private collection!: Collection<Room>;

  constructor(@inject(Dao) dao: Dao) {
    this.collection = dao.getCollection(CollectionName.ROOMS);
  }

  async insertRoom(room: Room): Promise<void> {
    await this.collection.insertOne(room);
  }

  async updateRoomsInBulk(rooms: Room[]): Promise<void> {
    await this.collection.bulkWrite(
      rooms.map(
        (room) => ({
          replaceOne: {
            filter: { id: room.id },
            replacement: room,
          },
        }),
        { ordered: false },
      ),
    );
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.collection.findOne({ id });
    if (room == null) {
      throw new Error(`Cannot find room with id ${id}`);
    }

    return room;
  }

  async getRoomByCode(code: string): Promise<Room | null> {
    return await this.collection.findOne({ code });
  }

  async getRoomIdByCode(code: string): Promise<number> {
    const room = await this.collection.findOne(
      { code },
      { projection: { _id: 0, id: 1 } },
    );
    if (room == null) {
      throw new Error(`Cannot find room with code ${code}`);
    }
    return room.id;
  }
}
