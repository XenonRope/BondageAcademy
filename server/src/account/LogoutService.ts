import { type Session } from "../session/model/Session";
import { worldService, type WorldService } from "../world/WorldService";

export class LogoutService {
  constructor(private worldService: WorldService) {}

  logout(session: Session): void {
    if (session.world != null && session.playerObject != null) {
      this.worldService.removeObject(session.world, session.playerObject.id);
    }

    session.account = undefined;
    session.world = undefined;
    session.player = undefined;
    session.playerObject = undefined;
  }
}

export const logoutService = new LogoutService(worldService);
