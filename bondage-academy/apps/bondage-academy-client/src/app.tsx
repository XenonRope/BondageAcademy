import {
  AddItemEvent,
  ChangePoseEvent,
  ChatMessageEvent,
  EventFromServer,
  GameObject,
  Position,
  SynchronizePlayersEvent,
} from "@bondage-academy/bondage-academy-model";
import { createEffect, type JSX } from "solid-js";
import AccountRegistrationPage from "./account/account-registration-page";
import {
  navigationService,
  socketService,
  store,
  storeService,
} from "./app/services";
import { View } from "./common/model/view";
import GamePage from "./game/game-page";
import HomePage from "./home/home-page";

export default function App() {
  createEffect(() => {
    if (store.socket == null) {
      const socket = socketService.connect();
      storeService.setSocket(socket);
      socket.on(
        EventFromServer.SynchronizeObjects,
        (msg: { objects?: GameObject[]; toRemove?: number[] }) => {
          storeService.updateObjects(msg);
        }
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
        }
      );
      socket.on(EventFromServer.ChangePose, (event: ChangePoseEvent) => {
        storeService.changePose(event);
      });
      socket.on(EventFromServer.AddItems, (event: AddItemEvent) => {
        storeService.addItems(event.playerId, event.items);
      });
      socket.on(EventFromServer.ChatMessage, (msg: ChatMessageEvent) => {
        storeService.addChatMessage(msg.message);
      });
      socket.on(
        EventFromServer.SynchronizePlayers,
        (msg: SynchronizePlayersEvent) => {
          storeService.updatePlayers(msg.players);
        }
      );
    }
  });

  function movePlayer(objectId: number): void {
    storeService.executePlayerMotion(objectId);
    if (store.motions?.[objectId] != null) {
      requestAnimationFrame(() => {
        movePlayer(objectId);
      });
    }
  }

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
