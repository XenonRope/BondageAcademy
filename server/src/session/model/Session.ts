import type { Socket } from "socket.io";
import type { Account } from "../../account/model/Account";
import type { Player } from "../../player/model/Player";

export interface Session {
  socket: Socket;
  account?: Account;
  player?: Player;
}
