import {
  type Collection,
  type CreateIndexesOptions,
  type IndexSpecification,
} from "mongodb";
import { inject, singleton } from "tsyringe";
import { Dao } from "../dao/dao";
import { CollectionName } from "../dao/model/collection-name";
import { Logger } from "../log/logger";
import { type MigrationLog } from "./model/migration-log";

@singleton()
export class MigrationService {
  private migrationLogs: Collection<MigrationLog>;

  constructor(
    @inject(Dao)
    private dao: Dao,
    @inject(Logger)
    private logger: Logger,
  ) {
    this.migrationLogs = dao.getCollection(CollectionName.MIGRATION_LOGS);
  }

  async migrate(): Promise<void> {
    await this.executeMigration("001_accounts_username_index", async () => {
      await this.createIndex(
        CollectionName.ACCOUNTS,
        { username: 1 },
        { unique: true },
      );
    });
    await this.executeMigration("002_players_name_index", async () => {
      await this.createIndex(
        CollectionName.PLAYERS,
        { name: 1 },
        { unique: true },
      );
    });
  }

  private async createIndex(
    collectionName: CollectionName,
    indexSpec: IndexSpecification,
    options?: CreateIndexesOptions,
  ): Promise<void> {
    await this.dao
      .getCollection(collectionName)
      .createIndex(indexSpec, options);
  }

  private async executeMigration(
    migrationId: string,
    migration: () => Promise<void>,
  ): Promise<void> {
    if (await this.migrationLogs.findOne({ migrationId })) {
      this.logger.info(`Migration ${migrationId}: Skipped`);
      return;
    }
    this.logger.info(`Migration ${migrationId}: Started`);
    const migrationLog: MigrationLog = {
      migrationId,
      timestamp: new Date(),
    };
    await migration();
    await this.migrationLogs.insertOne(migrationLog);
    this.logger.info(`Migration ${migrationId}: Finished`);
  }
}
