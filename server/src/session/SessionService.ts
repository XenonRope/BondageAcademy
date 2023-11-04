import type { Socket } from "socket.io";
import type { Session } from "./model/Session";

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

  removeSessionWithSocket(socket: Socket): void {
    this.sessionsBySocketsIds.delete(socket.id);
  }
}

export const sessionService = new SessionService();
