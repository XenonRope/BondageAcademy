import { dao, type Dao } from "../common/Dao";
import { sequences, type Sequences } from "../common/Sequences";
import { BusinessError } from "../common/model/BusinessError";
import { SequenceName } from "../common/model/SequenceName";
import {
  playerCreationService,
  type PlayerCreationService,
} from "../player/PlayerCreationService";
import { playerService, type PlayerService } from "../player/PlayerService";
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
    private dao: Dao,
    private playerService: PlayerService
  ) {}

  async registerAccount(params: AccountRegisterParams): Promise<Account> {
    if (await this.accountService.existsAccountWithUsername(params.username)) {
      throw new BusinessError("usernameAlreadyTaken");
    }
    if (await this.playerService.existsPlayerWithName(params.nick)) {
      throw new BusinessError("nickAlreadyTaken");
    }

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
  dao,
  playerService
);
