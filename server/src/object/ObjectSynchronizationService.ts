import type { GameObject } from "shared";
import { type Session } from "../session/model/Session";

export class ObjectSynchronizationService {
  async synchronizeObjects(
    params: { objects?: GameObject[]; toRemove?: number[] },
    sessions: Session[]
  ): Promise<void> {
    for (const session of sessions) {
      session.socket.emit("synchronize_world_objects", {
        objects: params.objects,
        toRemove: params.toRemove,
      });
    }
  }
}
