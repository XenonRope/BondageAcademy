import type { Socket } from "socket.io";
import type { Account } from "../../account/model/Account";
import type { Player } from "../../player/model/Player";
import { type PlayerObject } from "../../world/model/PlayerObject";
import { type World } from "../../world/model/World";

export interface Session {
  socket: Socket;
  account?: Account;
  world?: World;
  player?: Player;
  playerObject?: PlayerObject;
}
