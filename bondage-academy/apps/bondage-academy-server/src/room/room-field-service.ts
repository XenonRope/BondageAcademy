import {
  Position,
  Room,
  arePositionsEqual,
} from "@bondage-academy/bondage-academy-model";
import { singleton } from "tsyringe";

@singleton()
export class RoomFieldService {
  findFreeFieldInTransitArea(room: Room): Position | undefined {
    for (const transitArea of room.transitAreas) {
      for (let x = transitArea.x; x < transitArea.x + transitArea.width; x++) {
        for (
          let y = transitArea.y;
          y < transitArea.y + transitArea.height;
          y++
        ) {
          if (this.isFieldFree(room, { x, y })) {
            return { x, y };
          }
        }
      }
    }

    return undefined;
  }

  isFieldFree(room: Room, position: Position): boolean {
    for (const object of room.objects) {
      if (arePositionsEqual(object.position, position)) {
        return false;
      }
    }
    return true;
  }
}
