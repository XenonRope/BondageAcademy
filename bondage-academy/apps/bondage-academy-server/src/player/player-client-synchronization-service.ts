import {
  EventFromServer,
  Player,
  SynchronizePlayersRequest,
} from "@bondage-academy/bondage-academy-model";
import { Session } from "../session/model/session";

export class PlayerClientSynchronizationService {
  synchronizePlayers(players: Player[], sessions: Session[]): void {
    const requst: SynchronizePlayersRequest = {
      players,
    };
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizePlayers, requst);
    }
  }
}
