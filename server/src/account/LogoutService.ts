import { type Session } from "../session/model/Session";
import { type WorldService } from "../world/WorldService";

export class LogoutService {
  constructor(private worldService: WorldService) {}

  async logout(session: Session): Promise<void> {
    if (session.world != null && session.playerObject != null) {
      await this.worldService.removeObject(
        session.world,
        session.playerObject.id
      );
    }

    session.accountId = undefined;
    session.world = undefined;
    session.playerId = undefined;
    session.playerObject = undefined;

    session.socket.emit("logout");
  }
}
