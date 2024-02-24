import type { Socket } from "socket.io";
import { singleton } from "tsyringe";
import type { Session } from "./model/session";

@singleton()
export class SessionService {
  private sessionsBySocketsIds = new Map<string, Session>();

  getSessionBySocket(socket: Socket): Session {
    const existingConnection = this.sessionsBySocketsIds.get(socket.id);
    if (existingConnection != null) {
      return existingConnection;
    }

    const newSession = { socket };
    this.sessionsBySocketsIds.set(socket.id, newSession);

    return newSession;
  }

  getSessionByPlayerId(playerId: number): Session | undefined {
    for (const session of this.sessionsBySocketsIds.values()) {
      if (session.playerId === playerId) {
        return session;
      }
    }
    return undefined;
  }

  removeSessionWithSocket(socket: Socket): void {
    this.sessionsBySocketsIds.delete(socket.id);
  }
}
