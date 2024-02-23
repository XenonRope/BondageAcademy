import { Room } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { Store } from "../store/store";
import { RoomService } from "./room-service";

@singleton()
export class RoomStoreService extends Store<number, Room> {
  constructor(@inject(RoomService) private roomService: RoomService) {
    super();
  }

  protected override fetch(roomId: number): Promise<Room> {
    return this.roomService.getRoomById(roomId);
  }
}
