import { Socket } from "socket.io";

export interface Session {
  socket: Socket;
  accountId?: number;
  playerId?: number;
}
