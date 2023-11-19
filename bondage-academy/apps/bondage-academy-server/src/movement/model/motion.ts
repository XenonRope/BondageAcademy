import { Position } from "@bondage-academy/bondage-academy-model";

export interface Motion {
  objectId: number;
  targetPosition?: Position;
  motionEndEvent?: NodeJS.Timeout;
}
