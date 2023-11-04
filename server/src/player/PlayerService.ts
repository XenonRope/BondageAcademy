import { type Collection } from "mongodb";
import { dao, type Dao } from "../common/Dao";
import { CollectionName } from "../common/model/CollectionName";
import type { Player } from "./model/Player";

export class PlayerService {
  private collection!: Collection<Player>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.PLAYERS);
  }

  async insertPlayer(player: Player): Promise<void> {
    await this.collection.insertOne(player);
  }

  async getPlayer(id: number): Promise<Player | null> {
    return await this.collection.findOne({ id });
  }
}

export const playerService = new PlayerService(dao);
