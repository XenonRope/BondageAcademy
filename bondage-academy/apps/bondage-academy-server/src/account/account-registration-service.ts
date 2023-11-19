import { BusinessError } from "../api/model/business-error";
import { Dao } from "../dao/dao";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";
import { type PlayerCreationService } from "../player/player-creation-service";
import { type PlayerService } from "../player/player-service";
import { type AccountService } from "./account-service";
import type { Account } from "./model/account";

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
