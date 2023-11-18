import type { PlayerObject, World } from "shared";
import type { Socket } from "socket.io";

export interface Session {
  socket: Socket;
  accountId?: number;
  world?: World;
  playerId?: number;
  playerObject?: PlayerObject;
}
