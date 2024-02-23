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

    const newConnection = { socket };
    this.sessionsBySocketsIds.set(socket.id, newConnection);

    return newConnection;
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
