import type { ClientSession, Collection } from "mongodb";
import { type Dao } from "../common/Dao";
import { CollectionName } from "../common/model/CollectionName";
import type { Account } from "./model/Account";

export class AccountService {
  private collection!: Collection<Account>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.ACCOUNTS);
  }

  async insertAccount(
    account: Account,
    session?: ClientSession
  ): Promise<void> {
    await this.collection.insertOne(account, { session });
  }

  async existsAccountWithUsername(username: string): Promise<boolean> {
    return (await this.collection.countDocuments({ username })) > 0;
  }

  async getAccountByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<Account | null> {
    return await this.collection.findOne({ username, password });
  }
}
