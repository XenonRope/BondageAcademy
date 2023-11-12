import {
  MongoClient,
  type ClientSession,
  type Collection,
  type Db,
  type Document,
} from "mongodb";
import { type CollectionName } from "./model/CollectionName";

export class Dao {
  private client!: MongoClient;
  private database!: Db;

  initialize(): void {
    this.client = new MongoClient(
      "mongodb://root:root@localhost:27017/admin?replicaSet=rs0"
    );
    this.database = this.client.db("BondageAcademy");
  }

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
}

export const dao = new Dao();
dao.initialize();
