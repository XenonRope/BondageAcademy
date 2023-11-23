import {
  Item,
  SynchronizePlayersEvent,
} from "@bondage-academy/bondage-academy-model";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import type { SessionService } from "../session/session-service";

export class ItemService {
  constructor(
    private sessionService: SessionService,
    private playerStoreService: PlayerStoreService,
    private roomSessionService: RoomSessionService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService
  ) {}

  async addItemsToPlayer(playerId: number, items: Item[]): Promise<void> {
    await this.playerStoreService.update(playerId, (player) =>
      player.items.push(...items)
    );
    const event: SynchronizePlayersEvent = {
      updatePlayers: [
        {
          id: playerId,
          items: {
            add: items,
          },
        },
      ],
    };
    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      if (session) {
        this.playerClientSynchronizationService.synchronizePlayers(
          [session],
          event
        );
      }
      return;
    }
    const sessions = await this.roomSessionService.getSessionsInRoom(
      player.roomId
    );
    this.playerClientSynchronizationService.synchronizePlayers(sessions, event);
  }
}
