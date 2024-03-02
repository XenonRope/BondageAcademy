import {
  CharacterPose,
  EquippedItem,
  Item,
  Player,
  Slot,
} from "@bondage-academy/bondage-academy-model";
import { ClientSession, Collection } from "mongodb";
import { inject, singleton } from "tsyringe";
import { Dao } from "../dao/dao";
import { CollectionName } from "../dao/model/collection-name";

@singleton()
export class PlayerService {
  private collection!: Collection<Player>;

  constructor(@inject(Dao) dao: Dao) {
    this.collection = dao.getCollection(CollectionName.PLAYERS);
  }

  async insertPlayer(player: Player, session?: ClientSession): Promise<void> {
    await this.collection.insertOne(player, { session });
  }

  async getPlayer(id: number): Promise<Player> {
    const player = await this.collection.findOne({ id });
    if (player == null) {
      throw new Error(`Cannot find player with id ${id}`);
    }

    return player;
  }

  async getPlayersByIds(playerIds: number[]): Promise<Player[]> {
    return await this.collection.find({ id: { $in: playerIds } }).toArray();
  }

  async existsPlayerWithName(name: string): Promise<boolean> {
    return (await this.collection.countDocuments({ name })) > 0;
  }

  async updateRoomId(playerId: number, roomId?: number): Promise<void> {
    await this.collection.updateOne({ id: playerId }, { $set: { roomId } });
  }

  async updatePose(playerId: number, pose: CharacterPose): Promise<void> {
    await this.collection.updateOne(
      { id: playerId },
      { $set: { "character.pose": pose } },
    );
  }

  async updateEquippedItem(
    playerId: number,
    slot: Slot,
    equippedItem?: EquippedItem,
  ): Promise<void> {
    await this.collection.updateOne(
      { id: playerId },
      { $set: { [`character.wearables.${slot}`]: equippedItem } },
    );
  }

  async addItems(playerId: number, items: Item[]): Promise<void> {
    await this.collection.updateOne(
      { id: playerId },
      { $push: { items: { $each: items } } },
    );
  }

  async removeItemById(playerId: number, itemId: number): Promise<void> {
    await this.collection.updateOne(
      { id: playerId },
      { $pull: { items: { id: itemId } } },
    );
  }
}
