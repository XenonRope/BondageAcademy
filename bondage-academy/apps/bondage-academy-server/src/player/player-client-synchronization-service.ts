import {
  EventFromServer,
  Player,
  SynchronizePlayersEvent,
} from "@bondage-academy/bondage-academy-model";
import { Session } from "../session/model/session";

export class PlayerClientSynchronizationService {
  synchronizePlayers(players: Player[], sessions: Session[]): void {
    const requst: SynchronizePlayersEvent = {
      players,
    };
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizePlayers, requst);
    }
  }
}
