import { Room } from "@bondage-academy/bondage-academy-model";
import { Store } from "../store/store";
import { RoomService } from "./room-service";

export class RoomStoreService extends Store<number, Room> {
  constructor(private roomService: RoomService) {
    super();
  }

  protected override fetch(roomId: number): Promise<Room> {
    return this.roomService.getRoomById(roomId);
  }
}
