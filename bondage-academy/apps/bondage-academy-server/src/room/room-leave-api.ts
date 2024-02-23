import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { RoomLeaveService } from "./room-leave-service";

@singleton()
export class RoomLeaveApi {
  constructor(
    @inject(RoomLeaveService)
    private roomLeaveService: RoomLeaveService,
    @inject(MinigameService)
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
