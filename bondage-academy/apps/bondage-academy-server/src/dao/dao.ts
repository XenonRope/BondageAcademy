import { ClientSession, Collection, Db, Document, MongoClient } from "mongodb";
import { inject, registry, singleton } from "tsyringe";
import { CollectionName } from "./model/collection-name";

@registry([
  {
    token: "mongodbConnectionString",
    useValue:
      process.env.MONGODB_CONNECTION_STRING ??
      "mongodb://root:root@localhost:27017/admin?replicaSet=rs0",
  },
])
@singleton()
export class Dao {
  private _client?: MongoClient;
  private _database?: Db;

  constructor(
    @inject("mongodbConnectionString") private mongodbConnectionString: string,
  ) {}

  getCollection<T extends Document>(
    collectionName: CollectionName,
  ): Collection<T> {
    return this.database.collection<T>(collectionName);
  }

  async withTransaction<T>(
    action: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = this.client.startSession();
    return await session.withTransaction(async () => {
      return await action(session);
    });
  }

  private get client(): MongoClient {
    if (!this._client) {
      this._client = new MongoClient(this.mongodbConnectionString);
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
