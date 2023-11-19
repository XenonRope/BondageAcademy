import { ClientSession, Collection, Db, Document, MongoClient } from "mongodb";
import { CollectionName } from "./model/collection-name";

export class Dao {
  private _client?: MongoClient;
  private _database?: Db;

  getCollection<T extends Document>(
    collectionName: CollectionName
  ): Collection<T> {
    return this.database.collection<T>(collectionName);
  }

  async withTransaction<T>(
    action: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    const session = this.client.startSession();
    return await session.withTransaction(async () => {
      return await action(session);
    });
  }

  private get client(): MongoClient {
    if (!this._client) {
      this._client = new MongoClient(
        "mongodb://root:root@localhost:27017/admin?replicaSet=rs0"
      );
    }
    return this._client;
  }

  private get database(): Db {
    if (!this._database) {
      this._database = this.client.db("BondageAcademy");
    }
    return this._database;
  }
}
