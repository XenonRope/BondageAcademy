import {
  ChangePoseEvent,
  GameObject,
  Item,
  Player,
  PlayerObject,
  Position,
  Room,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { Socket } from "socket.io-client";
import { SetStoreFunction, produce } from "solid-js/store";
import { View } from "../common/model/view";
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

  getPositionByObjectId(objectId: number): Position | undefined {
    const motion = this.store.motions?.[objectId];
    if (motion && motion.currentPosition) {
      return motion.currentPosition;
    }

    return this.store.room?.objects.find((object) => object.id === objectId)
      ?.position;
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

  setPlayerId(playerId: number) {
    this.setStore({ playerId });
  }

  setRoom(room?: Room) {
    this.setStore({ room });
  }

  setPlayers(players: Player[]) {
    this.setStore({ players });
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
            for (let i = 0; i < room.objects.length; i++) {
              if (room.objects[i].id === newObject.id) {
                room.objects[i] = newObject;
                break;
              }
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

  changePose({ playerId, pose }: ChangePoseEvent) {
    this.setStore(
      produce(({ players }) => {
        const character = players?.find(
          (player) => player.id === playerId
        )?.character;
        if (character) {
          character.pose = pose;
        }
      })
    );
  }

  addItem(item: Item) {
    this.setStore(
      produce(({ playerId, players }) => {
        const player = players?.find((player) => player.id === playerId);
        player?.items.push(item);
      })
    );
  }
}
