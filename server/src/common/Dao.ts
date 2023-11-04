import { MongoClient, type Collection, type Db, type Document } from "mongodb";
import { type CollectionName } from "./model/CollectionName";

export class Dao {
  private database!: Db;

  initialize(): void {
    const client = new MongoClient("mongodb://root:root@localhost:27017");
    this.database = client.db("BondageAcademy");
  }

  getCollection<T extends Document>(
    collectionName: CollectionName
  ): Collection<T> {
    return this.database.collection<T>(collectionName);
  }
}

export const dao = new Dao();
dao.initialize();
