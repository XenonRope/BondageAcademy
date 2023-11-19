import { PlayerObject, World } from "@bondage-academy/bondage-academy-model";
import { Socket } from "socket.io";

export interface Session {
  socket: Socket;
  accountId?: number;
  world?: World;
  playerId?: number;
  playerObject?: PlayerObject;
}
