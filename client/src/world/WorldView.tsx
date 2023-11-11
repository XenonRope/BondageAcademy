import { trackBounds } from "solid-boundaries";
import { For, createMemo } from "solid-js";
import { socketService } from "../common/SocketService";
import { storeService } from "../store/StoreService";
import { isPlayerObject, type PlayerObject } from "./model/PlayerObject";
import { WORLD_TILE_SIZE, type World } from "./model/World";
import ObjectView from "./object/ObjectVIew";

export default function WorldView(props: { world: World }) {
  const { ref, bounds } = trackBounds();

  async function move(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    const rect = event.currentTarget?.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - offset().x) / 48);
    const y = Math.floor((event.clientY - rect.top - offset().y) / 48);
    if (x >= 0 && x < props.world.width && y >= 0 && y < props.world.height) {
      await socketService.emit("set_player_target_position", { x, y });
    }
  }

  const offset = createMemo(() => {
    const playerId = storeService.getStore().player?.id;
    const player = Object.values(props.world.objects).find(
      (object): object is PlayerObject =>
        isPlayerObject(object) && object.playerId === playerId,
    );

    const halfScreenWidth = (bounds()?.width ?? 0) / 2;
    const halfScreenHeight = (bounds()?.height ?? 0) / 2;
    const worldWidth = props.world.width * WORLD_TILE_SIZE;
    const worldHeight = props.world.height * WORLD_TILE_SIZE;
    let x =
      -(player?.motion?.currentPosition.x ?? player?.position.x ?? 0) *
        WORLD_TILE_SIZE +
      halfScreenWidth -
      WORLD_TILE_SIZE / 2;
    let y =
      -(player?.motion?.currentPosition.y ?? player?.position.y ?? 0) *
        WORLD_TILE_SIZE +
      halfScreenHeight -
      WORLD_TILE_SIZE / 2;

    if (x > 0) {
      x = 0;
    } else if (x < -worldWidth + (bounds()?.width ?? 0)) {
      x = -worldWidth + (bounds()?.width ?? 0);
    }
    if (y > 0) {
      y = 0;
    } else if (y < -worldHeight + (bounds()?.height ?? 0)) {
      y = -worldHeight + (bounds()?.height ?? 0);
    }

    return { x, y };
  });

  return (
    <div ref={ref} onClick={move} class="w-full h-full overflow-hidden">
      <div
        class="relative bg-green-100"
        style={{
          width: `${props.world.width * WORLD_TILE_SIZE}px`,
          height: `${props.world.height * WORLD_TILE_SIZE}px`,
          transform: `translate(${offset().x}px, ${offset().y}px)`,
        }}
      >
        <For each={Object.values(props.world.objects)}>
          {(object) => object != null && <ObjectView object={object} />}
        </For>
      </div>
    </div>
  );
}
