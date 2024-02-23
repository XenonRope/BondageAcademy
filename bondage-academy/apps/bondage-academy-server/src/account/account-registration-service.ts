import { inject, singleton } from "tsyringe";
import { BusinessError } from "../api/model/business-error";
import { Dao } from "../dao/dao";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";
import { PlayerCreationService } from "../player/player-creation-service";
import { PlayerService } from "../player/player-service";
import { AccountService } from "./account-service";
import type { Account } from "./model/account";

export interface AccountRegisterParams {
  username: string;
  password: string;
  nick: string;
}

@singleton()
export class AccountRegistrationService {
  constructor(
    @inject(AccountService)
    private accountService: AccountService,
    @inject(Sequences)
    private sequences: Sequences,
    @inject(PlayerCreationService)
    private playerCreationService: PlayerCreationService,
    @inject(Dao)
    private dao: Dao,
    @inject(PlayerService)
    private playerService: PlayerService,
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
        session,
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
