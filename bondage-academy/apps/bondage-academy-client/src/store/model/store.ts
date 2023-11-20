import {
  PartialRecord,
  Player,
  Room,
} from "@bondage-academy/bondage-academy-model";
import type { Socket } from "socket.io-client";
import type { View } from "../../common/model/view";
import type { SideMenuView } from "../../game/model/side-menu-view";
import type { RawDictionary } from "../../i18n/en";
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
}