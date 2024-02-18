import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { RoomLeaveService } from "./room-leave-service";

export class RoomLeaveApi {
  constructor(
    private roomLeaveService: RoomLeaveService,
    private minigameService: MinigameService,
  ) {}

  async leaveRoom(session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);

    await this.roomLeaveService.leaveRoom(session.playerId);
  }
}
