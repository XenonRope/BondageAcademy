import { Player } from "@bondage-academy/bondage-academy-model";
import { Store } from "../store/store";
import { PlayerService } from "./player-service";

export class PlayerStoreService extends Store<number, Player> {
  constructor(private playerService: PlayerService) {
    super();
  }

  protected override fetch(key: number): Promise<Player> {
    return this.playerService.getPlayer(key);
  }
}
