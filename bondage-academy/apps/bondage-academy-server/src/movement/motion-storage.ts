import { singleton } from "tsyringe";
import type { Motion } from "./model/motion";

@singleton()
export class MotionStorage {
  private motionByObjectId = new Map<number, Motion>();

  getOrCreateMotionByObjectId(objectId: number): Motion {
    let motion = this.motionByObjectId.get(objectId);
    if (motion == null) {
      motion = {
        objectId,
      };
      this.motionByObjectId.set(objectId, motion);
    }
    return motion;
  }

  stopMotion(objectId: number): void {
    const motion = this.motionByObjectId.get(objectId);
    if (motion != null) {
      clearTimeout(motion.motionEndEvent);
      this.motionByObjectId.delete(objectId);
    }
  }

  stopAllMotions(): void {
    for (const motion of this.motionByObjectId.values()) {
      clearTimeout(motion.motionEndEvent);
    }
    this.motionByObjectId.clear();
  }
}
