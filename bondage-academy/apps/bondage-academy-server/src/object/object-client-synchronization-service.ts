import {
  EventFromServer,
  SynchronizeGameObjects as SynchronizeObjects,
} from "@bondage-academy/bondage-academy-model";
import { type Session } from "../session/model/session";

export class ObjectClientSynchronizationService {
  synchronizeObjects(event: SynchronizeObjects, sessions: Session[]): void {
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizeObjects, event);
    }
  }
}
