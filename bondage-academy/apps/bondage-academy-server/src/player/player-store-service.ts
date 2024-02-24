import { Player } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { Logger } from "../log/logger";
import { Store } from "../store/store";
import { PlayerService } from "./player-service";

@singleton()
export class PlayerStoreService extends Store<number, Player> {
  constructor(
    @inject(PlayerService)
    private playerService: PlayerService,
    @inject(Logger)
    logger: Logger,
  ) {
    super(logger);
  }

  protected override fetch(key: number): Promise<Player> {
    return this.playerService.getPlayer(key);
  }
}
