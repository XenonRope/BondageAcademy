import { createEffect, type JSX } from "solid-js";
import AccountRegistrationPage from "./account/AccountRegistrationPage";
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
        (response: { objects?: WorldObject[]; toRemove?: number[] }) => {
          if (store.world != null) {
            const objects: Record<number, WorldObject | undefined> = {};
            response.objects?.forEach(
              (object) => (objects[object.id] = object),
            );
            response.toRemove?.forEach(
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
