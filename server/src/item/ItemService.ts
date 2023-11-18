import type { Item, Player } from "shared";
import type { SessionService } from "../session/SessionService";

export class ItemService {
  constructor(private sessionService: SessionService) {}

  addItemToPlayer(player: Player, item: Item): void {
    player.items.push(item);
    const session = this.sessionService.getSessionByPlayerId(player.id);
    session?.socket.emit("add_item", { item });
  }
}
