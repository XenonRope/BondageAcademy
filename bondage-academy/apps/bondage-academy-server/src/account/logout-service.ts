import { EventFromServer } from "@bondage-academy/bondage-academy-model";
import { type Session } from "../session/model/session";

export class LogoutService {
  logout(session: Session): void {
    session.accountId = undefined;
    session.playerId = undefined;

    session.socket.emit(EventFromServer.Logout);
  }
}
