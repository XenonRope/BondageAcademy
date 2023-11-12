import { type Player } from "../player/model/Player";
import { type SessionService } from "../session/SessionService";
import { type Item } from "./model/Item";

export class ItemService {
  constructor(private sessionService: SessionService) {}

  addItemToPlayer(player: Player, item: Item): void {
    player.items.push(item);
    const session = this.sessionService.getSessionByPlayerId(player.id);
    session?.socket.emit("add_item", { item });
  }
}
