import { Store } from "../store/Store";
import { type PlayerService } from "./PlayerService";
import { type Player } from "./model/Player";

export class PlayerStoreService extends Store<number, Player> {
  constructor(private playerService: PlayerService) {
    super();
  }

  protected override fetch(key: number): Promise<Player> {
    return this.playerService.getPlayer(key);
  }
}
