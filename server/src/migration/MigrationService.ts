import {
  type Collection,
  type CreateIndexesOptions,
  type IndexSpecification,
} from "mongodb";
import { type Dao } from "../common/Dao";
import { CollectionName } from "../common/model/CollectionName";
import { type MigrationLog } from "./model/MigrationLog";

export class MigrationService {
  private migrationLogs: Collection<MigrationLog>;

  constructor(private dao: Dao) {
    this.migrationLogs = dao.getCollection(CollectionName.MIGRATION_LOGS);
  }

  async migrate(): Promise<void> {
    await this.executeMigration("001_accounts_username_index", async () => {
      await this.createIndex(
        CollectionName.ACCOUNTS,
        { username: 1 },
        { unique: true }
      );
    });
    await this.executeMigration("002_players_name_index", async () => {
      await this.createIndex(
        CollectionName.PLAYERS,
        { name: 1 },
        { unique: true }
      );
    });
  }

  private async createIndex(
    collectionName: CollectionName,
    indexSpec: IndexSpecification,
    options?: CreateIndexesOptions
  ): Promise<void> {
    await this.dao
      .getCollection(collectionName)
      .createIndex(indexSpec, options);
  }

  private async executeMigration(
    migrationId: string,
    migration: () => Promise<void>
  ): Promise<void> {
    if (await this.migrationLogs.findOne({ migrationId })) {
      console.log(`Migration ${migrationId}: Skipped`);
      return;
    }
    console.log(`Migration ${migrationId}: Started`);
    const migrationLog: MigrationLog = {
      migrationId,
      timestamp: new Date(),
    };
    await migration();
    await this.migrationLogs.insertOne(migrationLog);
    console.log(`Migration ${migrationId}: Finished`);
  }
}
