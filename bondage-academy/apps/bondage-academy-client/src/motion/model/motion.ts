import { Position } from "@bondage-academy/bondage-academy-model";

export interface Motion {
  startPosition: Position;
  currentPosition: Position;
  endPosition: Position;
  startTime: Date;
  endTime: Date;
}
