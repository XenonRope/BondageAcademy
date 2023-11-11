import type { Socket } from "socket.io-client";
import { createStore, produce } from "solid-js/store";
import type { CharacterPose } from "../character/model/CharacterPose";
import type { Position } from "../common/model/Position";
import { View } from "../common/model/View";
import type { SideMenuView } from "../game/model/SideMenuView";
import type { Player } from "../player/model/Player";
import { isPlayerObject } from "../world/model/PlayerObject";
import type { World } from "../world/model/World";
import type { WorldObject } from "../world/model/WorldObject";

export interface Store {
  view: View;
  sideMenuView?: SideMenuView;
  socket?: Socket;
  player?: Player;
  world?: World;
}

const [store, setStore] = createStore<Store>({ view: View.Home });

export class StoreService {
  getStore() {
    return store;
  }

  setSocket(socket: Socket) {
    setStore("socket", socket);
  }

  setView(view: View) {
    setStore({ view });
  }

  setSideMenuView(sideMenuView?: SideMenuView) {
    setStore({ sideMenuView });
  }

  setPlayer(player: Player) {
    setStore({ player });
  }

  setWorld(world: World) {
    setStore({ world });
  }

  updateWorldObjects({
    objects,
    toRemove,
  }: {
    objects?: WorldObject[];
    toRemove?: number[];
  }) {
    setStore(
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
    setStore({
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
    setStore(
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
    setStore(
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
    setStore(
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
}

export const storeService = new StoreService();
export { store };
