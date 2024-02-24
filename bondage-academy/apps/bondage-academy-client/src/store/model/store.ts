import {
  Actor,
  ChatMessage,
  Minigame,
  PartialRecord,
  Player,
  RawDictionary,
  Room,
} from "@bondage-academy/bondage-academy-model";
import type { Socket } from "socket.io-client";
import { SetStoreFunction } from "solid-js/store";
import type { View } from "../../common/model/view";
import { ActionMenuView } from "../../game/model/action-menu-view";
import type { SideMenuView } from "../../game/model/side-menu-view";
import { Motion } from "../../motion/model/motion";

export type Locale = "en" | "pl";

export interface Store {
  locale: Locale;
  dictionary?: RawDictionary;
  view: View;
  socket?: Socket;
  playerId?: number;
  room?: Room;
  players?: Player[];
  motions?: PartialRecord<number, Motion>;
  sideMenuView?: SideMenuView;
  actionMenuView?: ActionMenuView;
  chatMessages?: ChatMessage[];
  selectedActor?: Actor;
  minigames?: Minigame[];
}

export type SetStore = SetStoreFunction<Store>;
