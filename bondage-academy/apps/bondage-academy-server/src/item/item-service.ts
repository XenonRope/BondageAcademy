import {
  Item,
  SynchronizePlayersEvent,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { SessionService } from "../session/session-service";
import { ItemIdProvider } from "./item-id-provider";

@singleton()
export class ItemService {
  constructor(
    @inject(SessionService)
    private sessionService: SessionService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(PlayerClientSynchronizationService)
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
    @inject(ItemIdProvider)
    private itemIdProvider: ItemIdProvider,
  ) {}

  async addItemsToPlayer(
    playerId: number,
    itemsToAdd: Omit<Item, "id">[],
  ): Promise<void> {
    const items: Item[] = [];
    for (const item of itemsToAdd) {
      items.push({
        ...item,
        id: await this.itemIdProvider.getNext(),
      });
    }
    await this.playerStoreService.addItems(playerId, items);
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
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      if (session) {
        this.playerClientSynchronizationService.synchronizePlayers(
          [session],
          event,
        );
      }
      return;
    }
    const sessions = await this.roomSessionService.getSessionsByRoomId(roomId);
    this.playerClientSynchronizationService.synchronizePlayers(sessions, event);
  }
}
