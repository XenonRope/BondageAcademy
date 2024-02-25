import {
  NPCCode,
  Room,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { Logger } from "../log/logger";
import { Store } from "../store/store";
import { RoomService } from "./room-service";

@singleton()
export class RoomStoreService extends Store<number, Room> {
  constructor(
    @inject(RoomService)
    private roomService: RoomService,
    @inject(Logger)
    logger: Logger,
  ) {
    super(logger);
  }

  async isNpcInRoom(roomId: number, npcCode: NPCCode): Promise<boolean> {
    const room = await this.get(roomId);
    return room.objects
      .filter(isNPCObject)
      .some((object) => object.code === npcCode);
  }

  protected override fetch(roomId: number): Promise<Room> {
    return this.roomService.getRoomById(roomId);
  }
}
