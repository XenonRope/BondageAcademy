import { dao, type Dao } from "../common/Dao";
import { sequences, type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import {
  playerCreationService,
  type PlayerCreationService,
} from "../player/PlayerCreationService";
import { accountService, type AccountService } from "./AccountService";
import type { Account } from "./model/Account";

export interface AccountRegisterParams {
  username: string;
  password: string;
  nick: string;
}

export class AccountRegistrationService {
  constructor(
    private accountService: AccountService,
    private sequences: Sequences,
    private playerCreationService: PlayerCreationService,
    private dao: Dao
  ) {}

  async registerAccount(params: AccountRegisterParams): Promise<Account> {
    return await this.dao.withTransaction(async (session) => {
      const player = await this.playerCreationService.createPlayer(
        {
          name: params.nick,
        },
        session
      );
      const id = await this.sequences.getNext(SequenceName.ACCOUNT);
      const account: Account = {
        id,
        playerId: player.id,
        username: params.username,
        password: params.password,
      };
      await this.accountService.insertAccount(account, session);

      return account;
    });
  }
}

export const accountRegistrationService = new AccountRegistrationService(
  accountService,
  sequences,
  playerCreationService,
  dao
);
