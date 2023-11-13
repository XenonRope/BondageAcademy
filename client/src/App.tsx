import { createEffect, type JSX } from "solid-js";
import AccountRegistrationPage from "./account/AccountRegistrationPage";
import type { CharacterPose } from "./character/model/CharacterPose";
import type { Position } from "./common/model/Position";
import { View } from "./common/model/View";
import { navigationService } from "./common/NavigationService";
import { socketService } from "./common/SocketService";
import GamePage from "./game/GamePage";
import HomePage from "./home/HomePage";
import type { Item } from "./item/model/Item";
import { localeService } from "./locale/services/LocaleService";
import { storeService } from "./store/StoreService";
import { isPlayerObject } from "./world/model/PlayerObject";
import type { WorldObject } from "./world/model/WorldObject";

export default function App() {
  localeService.initialize();

  createEffect(() => {
    if (storeService.getStore().socket == null) {
      const socket = socketService.connect();
      storeService.setSocket(socket);
      socket.on(
        "synchronize_world_objects",
        (msg: { objects?: WorldObject[]; toRemove?: number[] }) => {
          storeService.updateWorldObjects(msg);
        },
      );
      socket.on("logout", () => {
        storeService.logout();
        navigationService.navigate(View.Home);
      });
      socket.on(
        "move_player",
        (msg: { objectId: number; position: Position; duration: number }) => {
          storeService.setPlayerMotion(msg);
          requestAnimationFrame(() => {
            movePlayer(msg.objectId);
          });
        },
      );
      socket.on(
        "change_pose",
        (msg: { playerId: number; pose: CharacterPose }) => {
          storeService.changePose(msg);
        },
      );
      socket.on("add_item", (msg: { item: Item }) => {
        storeService.addItem(msg.item);
      });
    }
  });

  function movePlayer(objectId: number): void {
    storeService.executePlayerMotion(objectId);
    const object = storeService.getStore().world?.objects[objectId];
    if (isPlayerObject(object) && object.motion != null) {
      requestAnimationFrame(() => {
        movePlayer(objectId);
      });
    }
  }

  function renderView(): JSX.Element {
    switch (storeService.getStore().view) {
      case View.Home:
        return <HomePage />;
      case View.RegisterAccount:
        return <AccountRegistrationPage />;
      case View.Game:
        return <GamePage />;
    }
  }

  return <>{renderView()}</>;
}
