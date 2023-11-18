import { type ClientSession, type Collection } from "mongodb";
import { type Dao } from "../common/Dao";
import { CollectionName } from "../common/model/CollectionName";
import type { Player } from "./model/Player";

export class PlayerService {
  private collection!: Collection<Player>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.PLAYERS);
  }

  async insertPlayer(player: Player, session?: ClientSession): Promise<void> {
    await this.collection.insertOne(player, { session });
  }

  async updatePlayersInBulk(players: Player[]): Promise<void> {
    await this.collection.bulkWrite(
      players.map(
        (player) => ({
          replaceOne: {
            filter: { id: player.id },
            replacement: player,
          },
        }),
        { ordered: false }
      )
    );
  }

  async getPlayer(id: number): Promise<Player> {
    const player = await this.collection.findOne({ id });
    if (player == null) {
      throw new Error(`Cannot find player with id ${id}`);
    }

    return player;
  }

  async existsPlayerWithName(name: string): Promise<boolean> {
    return (await this.collection.countDocuments({ name })) > 0;
  }
}
