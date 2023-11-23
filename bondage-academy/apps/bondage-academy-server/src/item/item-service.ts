import {
  AddItemEvent,
  EventFromServer,
  Item,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import type { SessionService } from "../session/session-service";

export class ItemService {
  constructor(
    private sessionService: SessionService,
    private playerStoreService: PlayerStoreService,
    private roomSessionService: RoomSessionService
  ) {}

  async addItemsToPlayer(playerId: number, items: Item[]): Promise<void> {
    await this.playerStoreService.update(playerId, (player) =>
      player.items.push(...items)
    );
    const event: AddItemEvent = {
      playerId,
      items,
    };
    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      session?.socket.emit(EventFromServer.AddItems, event);
      return;
    }
    const sessions = await this.roomSessionService.getSessionsInRoom(
      player.roomId
    );
    sessions.forEach((session) =>
      session.socket.emit(EventFromServer.AddItems, event)
    );
  }
}
