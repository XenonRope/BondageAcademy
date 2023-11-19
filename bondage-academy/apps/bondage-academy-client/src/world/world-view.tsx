import { World } from "@bondage-academy/bondage-academy-model";
import { trackBounds } from "solid-boundaries";
import { For, createMemo } from "solid-js";
import { socketService, storeService } from "../app/services";
import { WORLD_TILE_SIZE } from "./model/world";
import ObjectView from "./object/object-view";

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
    const position = storeService.getPlayerPosition();

    const halfScreenWidth = (bounds()?.width ?? 0) / 2;
    const halfScreenHeight = (bounds()?.height ?? 0) / 2;
    const worldWidth = props.world.width * WORLD_TILE_SIZE;
    const worldHeight = props.world.height * WORLD_TILE_SIZE;
    let x =
      -(position?.x ?? 0) * WORLD_TILE_SIZE +
      halfScreenWidth -
      WORLD_TILE_SIZE / 2;
    let y =
      -(position?.y ?? 0) * WORLD_TILE_SIZE +
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

    if (worldWidth < (bounds()?.width ?? 0)) {
      x = 0;
    }
    if (worldHeight < (bounds()?.height ?? 0)) {
      y = 0;
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
