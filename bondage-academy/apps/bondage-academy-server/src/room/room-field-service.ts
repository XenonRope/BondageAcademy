import { Position } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomFieldService {
  constructor(
    @inject(RoomStoreService) private roomStoreService: RoomStoreService,
  ) {}

  async findFreeFieldInTransitArea(
    roomId: number,
  ): Promise<Position | undefined> {
    const transitAreas = await this.roomStoreService.getTransitAreas(roomId);
    for (const transitArea of transitAreas) {
      for (let x = transitArea.x; x < transitArea.x + transitArea.width; x++) {
        for (
          let y = transitArea.y;
          y < transitArea.y + transitArea.height;
          y++
        ) {
          if (await this.isFieldFree(roomId, { x, y })) {
            return { x, y };
          }
        }
      }
    }

    return undefined;
  }

  async isFieldFree(roomId: number, position: Position): Promise<boolean> {
    return await this.roomStoreService.isFieldFree(roomId, position);
  }
}
