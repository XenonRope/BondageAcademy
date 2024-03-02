import {
  EventFromServer,
  SynchronizePlayersEvent,
  UpdatePlayer,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { RoomSessionService } from "../room/room-session-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";
import { PlayerStoreService } from "./player-store-service";

@singleton()
export class PlayerClientSynchronizationService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(SessionService)
    private sessionService: SessionService,
  ) {}

  async synchronizePlayerByPlayerId(
    playerId: number,
    updatePlayer: Omit<UpdatePlayer, "id">,
  ): Promise<void> {
    const event: SynchronizePlayersEvent = {
      updatePlayers: [{ ...updatePlayer, id: playerId }],
    };
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      if (session) {
        this.synchronizePlayers([session], event);
      }
      return;
    }
    const sessions = await this.roomSessionService.getSessionsByRoomId(roomId);
    this.synchronizePlayers(sessions, event);
  }

  synchronizePlayers(
    sessions: Session[],
    event: SynchronizePlayersEvent,
  ): void {
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizePlayers, event);
    }
  }
}
