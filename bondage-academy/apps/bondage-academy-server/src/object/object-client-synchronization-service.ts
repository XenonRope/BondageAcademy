import {
  EventFromServer,
  GameObject,
} from "@bondage-academy/bondage-academy-model";
import { type Session } from "../session/model/session";

export class ObjectClientSynchronizationService {
  synchronizeObjects(
    params: { objects?: GameObject[]; toRemove?: number[] },
    sessions: Session[]
  ): void {
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizeObjects, {
        objects: params.objects,
        toRemove: params.toRemove,
      });
    }
  }
}
