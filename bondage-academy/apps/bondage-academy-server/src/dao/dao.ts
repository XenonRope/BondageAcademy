import { ClientSession, Collection, Db, Document, MongoClient } from "mongodb";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { token } from "../app/token";
import { CollectionName } from "./model/collection-name";

const MONGODB_CONNECTION_STRING = token<string>("mongodbConnectionString");

@registry([
  {
    token: MONGODB_CONNECTION_STRING,
    useFactory: instanceCachingFactory(
      () =>
        process.env.MONGODB_CONNECTION_STRING ??
        "mongodb://root:root@localhost:27017/admin?replicaSet=rs0",
    ),
  },
])
@singleton()
export class Dao {
  private _client?: MongoClient;
  private _database?: Db;

  constructor(
    @inject(MONGODB_CONNECTION_STRING) private mongodbConnectionString: string,
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
