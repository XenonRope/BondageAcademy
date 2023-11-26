import {
  ChatMessage,
  GameObject,
  Minigame,
  Player,
  PlayerObject,
  Position,
  Room,
  Slot,
  SynchronizeMinigamesEvent,
  SynchronizePlayersEvent,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { Socket } from "socket.io-client";
import { SetStoreFunction, produce } from "solid-js/store";
import { View } from "../common/model/view";
import { ActionMenuView } from "../game/model/action-menu-view";
import { SideMenuView } from "../game/model/side-menu-view";
import { Locale, Store } from "./model/store";

export class StoreService {
  constructor(
    private store: Store,
    private setStore: SetStoreFunction<Store>
  ) {}

  getPlayerPosition(): Position | undefined {
    const playerObject = this.store.room?.objects?.find(
      (object) =>
        isPlayerObject(object) && object.playerId === this.store.playerId
    );
    return playerObject?.id
      ? this.getPositionByObjectId(playerObject.id)
      : undefined;
  }

  getPlayerObject(): PlayerObject | undefined {
    for (const object of this.store.room?.objects ?? []) {
      if (isPlayerObject(object) && object.playerId === this.store.playerId) {
        return object;
      }
    }
    return undefined;
  }

  getPlayer(): Player | undefined {
    if (this.store.playerId && this.store.players) {
      return this.store.players.find(
        (player) => player.id === this.store.playerId
      );
    }
    return undefined;
  }

  getPlayerById(playerId: number): Player | undefined {
    if (this.store.players) {
      return this.store.players.find((player) => player.id === playerId);
    }
    return undefined;
  }

  getPositionByObjectId(objectId: number): Position | undefined {
    const motion = this.store.motions?.[objectId];
    if (motion && motion.currentPosition) {
      return motion.currentPosition;
    }

    return this.store.room?.objects.find((object) => object.id === objectId)
      ?.position;
  }

  getSelectedPlayer(): Player | undefined {
    if (this.store.selectedPlayer && this.store.players) {
      return this.store.players.find(
        (player) => player.id === this.store.selectedPlayer
      );
    }
    return undefined;
  }

  setLocale(locale: Locale) {
    this.setStore({ locale });
  }

  setSocket(socket: Socket) {
    this.setStore("socket", socket);
  }

  setView(view: View) {
    this.setStore({ view });
  }

  setSideMenuView(sideMenuView?: SideMenuView) {
    this.setStore({ sideMenuView });
  }

  setActionMenuView(actionMenuView?: ActionMenuView) {
    this.setStore({ actionMenuView });
  }

  setPlayerId(playerId: number) {
    this.setStore({ playerId });
  }

  setRoom(room?: Room) {
    this.setStore({ room });
  }

  setPlayers(players: Player[]) {
    this.setStore({ players });
  }

  setMinigames(minigames?: Minigame[]) {
    this.setStore({ minigames });
  }

  synchronizePlayers(event: SynchronizePlayersEvent) {
    this.setStore(
      produce((store) => {
        if (!store.players) {
          store.players = [];
        }
        if (event.replacePlayers) {
          for (const newPlayer of event.replacePlayers) {
            let replaced = false;
            for (let i = 0; i < store.players.length; i++) {
              if (store.players[i].id === newPlayer.id) {
                store.players[i] = newPlayer;
                replaced = true;
                break;
              }
            }
            if (!replaced) {
              store.players.push(newPlayer);
            }
          }
        }
        for (const updatedPlayer of event.updatePlayers ?? []) {
          for (const player of store.players) {
            if (player.id === updatedPlayer.id) {
              if (updatedPlayer.pose) {
                player.character.pose = updatedPlayer.pose;
              }
              if (updatedPlayer.items && updatedPlayer.items.add) {
                player.items.push(...updatedPlayer.items.add);
              }
              if (updatedPlayer.items && updatedPlayer.items.remove) {
                player.items = player.items.filter(
                  (item) => !updatedPlayer.items?.remove?.includes(item.id)
                );
              }
              for (const { slot, equippedItem } of updatedPlayer.wearables ??
                []) {
                player.character.wearables[slot as Slot] = equippedItem;
              }
              break;
            }
          }
        }
      })
    );
  }

  synchronizeMinigames(event: SynchronizeMinigamesEvent): void {
    this.setStore(
      produce((store) => {
        if (!store.minigames) {
          store.minigames = [];
        }
        if (event.replaceMinigames) {
          for (const newMinigame of event.replaceMinigames) {
            let replaced = false;
            for (let i = 0; i < store.minigames.length; i++) {
              if (store.minigames[i].id === newMinigame.id) {
                store.minigames[i] = newMinigame;
                replaced = true;
                break;
              }
            }
            if (!replaced) {
              store.minigames.push(newMinigame);
            }
          }
        }
        if (event.updateMinigames) {
          for (const updatedMinigame of event.updateMinigames) {
            for (const minigame of store.minigames) {
              if (minigame.id === updatedMinigame.id) {
                break;
              }
            }
          }
        }
      })
    );
  }

  updateObjects({
    objects,
    toRemove,
  }: {
    objects?: GameObject[];
    toRemove?: number[];
  }) {
    this.setStore(
      "room",
      produce((room) => {
        if (room != null) {
          for (const newObject of objects ?? []) {
            let replaced = false;
            for (let i = 0; i < room.objects.length; i++) {
              if (room.objects[i].id === newObject.id) {
                room.objects[i] = newObject;
                replaced = true;
                break;
              }
            }
            if (!replaced) {
              room.objects.push(newObject);
            }
          }
          if (toRemove) {
            room.objects = room.objects.filter(
              (object) => !toRemove.includes(object.id)
            );
          }
        }
      })
    );
  }

  logout() {
    this.setStore({
      playerId: undefined,
      room: undefined,
      players: undefined,
      motions: undefined,
      sideMenuView: undefined,
      chatMessages: undefined,
    });
  }

  setPlayerMotion({
    objectId,
    position,
    duration,
  }: {
    objectId: number;
    position: Position;
    duration: number;
  }) {
    this.setStore(
      produce((store) => {
        const object = store.room?.objects?.find((obj) => obj.id === objectId);
        if (isPlayerObject(object)) {
          const startPosition = object.position;
          const now = new Date();
          object.position = position;

          if (!store.motions) {
            store.motions = {};
          }
          store.motions[objectId] = {
            startPosition,
            currentPosition: startPosition,
            endPosition: position,
            startTime: now,
            endTime: new Date(now.getTime() + duration),
          };
        }
      })
    );
  }

  executePlayerMotion(objectId: number) {
    this.setStore(
      produce(({ room, motions }) => {
        const object = room?.objects.find((obj) => obj.id === objectId);
        const motion = motions?.[objectId];
        if (!isPlayerObject(object) || motions == null || motion == null) {
          return;
        }
        const now = new Date();
        if (now >= motion.endTime) {
          motions[objectId] = undefined;
          return;
        }
        const timeFraction =
          (now.getTime() - motion.startTime.getTime()) /
          (motion.endTime.getTime() - motion.startTime.getTime());
        motion.currentPosition = {
          x:
            motion.startPosition.x +
            (motion.endPosition.x - motion.startPosition.x) * timeFraction,
          y:
            motion.startPosition.y +
            (motion.endPosition.y - motion.startPosition.y) * timeFraction,
        };
      })
    );
  }

  clearChatMessages() {
    this.setStore({ chatMessages: undefined });
  }

  addChatMessage(message: ChatMessage): void {
    this.setStore(
      produce((store) => {
        if (!store.chatMessages) {
          store.chatMessages = [];
        }
        store.chatMessages.push(message);
        store.chatMessages.sort(
          (firstMessage, secondMessage) =>
            firstMessage.time - secondMessage.time
        );
      })
    );
  }

  selectPlayer(playerId?: number): void {
    if (this.store.selectedPlayer !== playerId) {
      this.setStore({
        selectedPlayer: playerId,
        actionMenuView: undefined,
      });
    }
  }
}
