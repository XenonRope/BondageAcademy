import {
  CharacterPose,
  EquippedItem,
  GameObject,
  Item,
  ObjectType,
  Position,
  Room,
  Slot,
} from "@bondage-academy/bondage-academy-model";
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

  async updateObjectPostion(
    roomId: number,
    objectId: number,
    position: Position,
  ): Promise<void> {
    await this.collection.updateOne(
      { id: roomId, "objects.id": objectId },
      { $set: { [`objects.$.position`]: position } },
    );
  }

  async updateNpcPose(
    roomId: number,
    objectId: number,
    pose: CharacterPose,
  ): Promise<void> {
    await this.collection.updateOne(
      {
        id: roomId,
        objects: { $elemMatch: { id: objectId, type: ObjectType.NPC } },
      },
      { $set: { [`objects.$.character.pose`]: pose } },
    );
  }

  async updateNpcEquippedItem(
    roomId: number,
    objectId: number,
    slot: Slot,
    item?: EquippedItem,
  ): Promise<void> {
    await this.collection.updateOne(
      {
        id: roomId,
        objects: { $elemMatch: { id: objectId, type: ObjectType.NPC } },
      },
      { $set: { [`objects.$.character.wearables.${slot}`]: item } },
    );
  }

  async addItemsToNpc(
    roomId: number,
    objectId: number,
    items: Item[],
  ): Promise<void> {
    await this.collection.updateOne(
      {
        id: roomId,
        objects: { $elemMatch: { id: objectId, type: ObjectType.NPC } },
      },
      { $push: { [`objects.$.items`]: { $each: items } } },
    );
  }

  async addObject(roomId: number, object: GameObject): Promise<void> {
    await this.collection.updateOne(
      { id: roomId },
      { $push: { objects: object } },
    );
  }

  async removeObjectById(roomId: number, objectId: number): Promise<void> {
    await this.collection.updateOne(
      { id: roomId },
      { $pull: { objects: { id: objectId } } },
    );
  }
}
