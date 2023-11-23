import {
  EventFromServer,
  SynchronizePlayersEvent,
} from "@bondage-academy/bondage-academy-model";
import { Session } from "../session/model/session";

export class PlayerClientSynchronizationService {
  synchronizePlayers(
    sessions: Session[],
    event: SynchronizePlayersEvent
  ): void {
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizePlayers, event);
    }
  }
}
