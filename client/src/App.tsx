import { createEffect, type JSX } from "solid-js";
import AccountRegistrationPage from "./account/AccountRegistrationPage";
import type { Position } from "./common/model/Position";
import { View } from "./common/model/View";
import { navigationService } from "./common/NavigationService";
import { socketService } from "./common/SocketService";
import { setStore, store } from "./common/Store";
import GamePage from "./game/GamePage";
import HomePage from "./home/HomePage";
import type { WorldObject } from "./world/model/WorldObject";

export default function App() {
  createEffect(() => {
    if (store.socket == null) {
      const socket = socketService.connect();
      setStore({ socket });
      socket.on(
        "synchronize_world_objects",
        (msg: { objects?: WorldObject[]; toRemove?: number[] }) => {
          if (store.world != null) {
            const objects: Record<number, WorldObject | undefined> = {};
            msg.objects?.forEach((object) => (objects[object.id] = object));
            msg.toRemove?.forEach(
              (objectId) => (objects[objectId] = undefined),
            );
            setStore("world", "objects", objects);
          }
        },
      );
      socket.on("logout", () => {
        setStore({
          player: undefined,
          world: undefined,
        });
        navigationService.navigate(View.Home);
      });
      socket.on(
        "move_player",
        (msg: { objectId: number; position: Position; duration: number }) => {
          if (store.world?.objects?.[msg.objectId] != null) {
            setStore(
              "world",
              "objects",
              msg.objectId,
              "position",
              msg.position,
            );
          }
        },
      );
    }
  });

  function renderView(): JSX.Element {
    switch (store.view) {
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
