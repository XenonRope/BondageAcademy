import type { Socket } from "socket.io-client";
import { produce, type SetStoreFunction } from "solid-js/store";
import type { CharacterPose } from "../character/model/CharacterPose";
import type { Position } from "../common/model/Position";
import { type View } from "../common/model/View";
import type { SideMenuView } from "../game/model/SideMenuView";
import type { Item } from "../item/model/Item";
import type { Player } from "../player/model/Player";
import { isPlayerObject } from "../world/model/PlayerObject";
import type { World } from "../world/model/World";
import type { WorldObject } from "../world/model/WorldObject";
import type { Locale, Store } from "./model/store";

export class StoreService {
  constructor(private setStore: SetStoreFunction<Store>) {}

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

  setPlayer(player: Player) {
    this.setStore({ player });
  }

  setWorld(world: World) {
    this.setStore({ world });
  }

  updateWorldObjects({
    objects,
    toRemove,
  }: {
    objects?: WorldObject[];
    toRemove?: number[];
  }) {
    this.setStore(
      "world",
      produce((world) => {
        if (world != null) {
          objects?.forEach((object) => (world.objects[object.id] = object));
          toRemove?.forEach(
            (objectId) => (world.objects[objectId] = undefined),
          );
        }
      }),
    );
  }

  logout() {
    this.setStore({
      player: undefined,
      world: undefined,
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
      "world",
      produce((world) => {
        const object = world?.objects[objectId];
        if (isPlayerObject(object)) {
          const startPosition = object.position;
          const now = new Date();
          object.position = position;
          object.motion = {
            startPosition,
            currentPosition: startPosition,
            endPosition: position,
            startTime: now,
            endTime: new Date(now.getTime() + duration),
          };
        }
      }),
    );
  }

  executePlayerMotion(objectId: number) {
    this.setStore(
      produce(({ world }) => {
        const object = world?.objects[objectId];
        if (!isPlayerObject(object) || object.motion == null) {
          return;
        }
        const motion = object.motion;
        const now = new Date();
        if (now >= motion.endTime) {
          object.motion = undefined;
          return;
        }
        const timeFraction =
          (now.getTime() - motion.startTime.getTime()) /
          (motion.endTime.getTime() - motion.startTime.getTime());
        object.motion.currentPosition = {
          x:
            motion.startPosition.x +
            (motion.endPosition.x - motion.startPosition.x) * timeFraction,
          y:
            motion.startPosition.y +
            (motion.endPosition.y - motion.startPosition.y) * timeFraction,
        };
      }),
    );
  }

  changePose({ playerId, pose }: { playerId: number; pose: CharacterPose }) {
    this.setStore(
      produce(({ world, player }) => {
        for (const object of Object.values(world?.objects ?? {})) {
          if (isPlayerObject(object) && object.playerId === playerId) {
            object.character.pose = pose;
          }
        }
        if (player?.id === playerId) {
          player.character.pose = pose;
        }
      }),
    );
  }

  addItem(item: Item) {
    this.setStore(
      produce(({ player }) => {
        player?.items.push(item);
      }),
    );
  }
}
