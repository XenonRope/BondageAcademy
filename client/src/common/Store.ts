import type { Socket } from "socket.io-client";
import { createStore } from "solid-js/store";
import type { Player } from "../player/model/Player";
import { View } from "./model/View";

export interface Store {
  view: View;
  socket?: Socket;
  player?: Player;
}

export const [store, setStore] = createStore<Store>({ view: View.Home });
