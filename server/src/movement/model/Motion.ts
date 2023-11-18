import type { Position } from "../../common/model/Position";

export interface Motion {
  objectId: number;
  targetPosition?: Position;
  motionEndEvent?: NodeJS.Timeout;
}
