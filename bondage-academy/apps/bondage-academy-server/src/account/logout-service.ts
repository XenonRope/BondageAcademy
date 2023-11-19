import { type Session } from "../session/model/session";
import { type WorldService } from "../world/world-service";

export class LogoutService {
  constructor(private worldService: WorldService) {}

  logout(session: Session): void {
    if (session.world != null && session.playerObject != null) {
      this.worldService.removeObject(session.world, session.playerObject.id);
    }

    session.accountId = undefined;
    session.world = undefined;
    session.playerId = undefined;
    session.playerObject = undefined;

    session.socket.emit("logout");
  }
}
