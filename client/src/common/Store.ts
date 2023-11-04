import type { Socket } from "socket.io-client";
import { createStore } from "solid-js/store";
import type { Player } from "../player/model/Player";
import type { World } from "../world/model/World";
import { View } from "./model/View";

export interface Store {
  view: View;
  socket?: Socket;
  player?: Player;
  world?: World;
}

export const [store, setStore] = createStore<Store>({ view: View.Home });
