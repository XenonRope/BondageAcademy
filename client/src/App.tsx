import { createEffect, type JSX } from "solid-js";
import AccountRegistrationPage from "./account/AccountRegistrationPage";
import { View } from "./common/model/View";
import { socketService } from "./common/SocketService";
import { setStore, store } from "./common/Store";
import GamePage from "./game/GamePage";
import HomePage from "./home/HomePage";

export default function App() {
  createEffect(() => {
    if (store.socket == null) {
      setStore({ socket: socketService.connect() });
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
