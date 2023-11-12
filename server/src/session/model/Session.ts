import type { Socket } from "socket.io";
import { type PlayerObject } from "../../world/model/PlayerObject";
import { type World } from "../../world/model/World";

export interface Session {
  socket: Socket;
  accountId?: number;
  world?: World;
  playerId?: number;
  playerObject?: PlayerObject;
}
