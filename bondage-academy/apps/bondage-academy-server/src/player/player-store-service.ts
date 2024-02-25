import { Item, Player } from "@bondage-academy/bondage-academy-model";
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

  async getPlayerName(playerId: number): Promise<string> {
    const player = await this.get(playerId);
    return player.name;
  }

  async getPlayerRoomId(playerId: number): Promise<number | undefined> {
    const player = await this.get(playerId);
    return player.roomId;
  }

  async addItems(playerId: number, items: Item[]): Promise<void> {
    await this.update(playerId, (player) => player.items.push(...items));
  }

  protected override fetch(key: number): Promise<Player> {
    return this.playerService.getPlayer(key);
  }
}
