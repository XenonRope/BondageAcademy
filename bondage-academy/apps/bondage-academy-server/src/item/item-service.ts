import { Item, Player } from "@bondage-academy/bondage-academy-model";
import type { SessionService } from "../session/session-service";

export class ItemService {
  constructor(private sessionService: SessionService) {}

  addItemToPlayer(player: Player, item: Item): void {
    player.items.push(item);
    const session = this.sessionService.getSessionByPlayerId(player.id);
    session?.socket.emit("add_item", { item });
  }
}
