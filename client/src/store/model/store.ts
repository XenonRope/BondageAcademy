import type { Socket } from "socket.io-client";
import type { View } from "../../common/model/View";
import type { SideMenuView } from "../../game/model/SideMenuView";
import type { RawDictionary } from "../../i18n/en";
import type { Player } from "../../player/model/Player";
import type { World } from "../../world/model/World";

export type Locale = "en" | "pl";

export interface Store {
  locale: Locale;
  dictionary?: RawDictionary;
  view: View;
  sideMenuView?: SideMenuView;
  socket?: Socket;
  player?: Player;
  world?: World;
}
