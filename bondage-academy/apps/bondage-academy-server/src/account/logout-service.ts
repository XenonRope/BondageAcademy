import { type Session } from "../session/model/session";

export class LogoutService {
  constructor() {}

  logout(session: Session): void {
    session.accountId = undefined;
    session.playerId = undefined;

    session.socket.emit("logout");
  }
}
