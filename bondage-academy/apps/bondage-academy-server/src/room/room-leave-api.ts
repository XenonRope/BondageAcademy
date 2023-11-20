import { Session } from "../session/model/session";
import { RoomLeaveService } from "./room-leave-service";

export class RoomLeaveApi {
  constructor(private roomLeaveService: RoomLeaveService) {}

  async leaveRoom(session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    await this.roomLeaveService.leaveRoom(session.playerId);
  }
}
