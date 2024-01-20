import { trackBounds } from "solid-boundaries";
import { For, createMemo } from "solid-js";
import { socketService, store, storeService } from "../app/services";
import { ROOM_TILE_SIZE } from "./model/room";
import ObjectView from "./object/object-view";
import RoomBackgroundElementView from "./room-background-element-view";

export default function RoomView() {
  const { ref, bounds } = trackBounds();

  function move(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    if (!store.room) {
      return;
    }

    const rect = event.currentTarget?.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - offset().x) / 48);
    const y = Math.floor((event.clientY - rect.top - offset().y) / 48);
    if (x >= 0 && x < store.room.width && y >= 0 && y < store.room.height) {
      socketService
        .emit("set_player_target_position", { x, y })
        .catch(console.log);
    }
  }

  const offset = createMemo(() => {
    if (!store.room) {
      return { x: 0, y: 0 };
    }

    const position = storeService.getPlayerPosition();

    const halfScreenWidth = (bounds()?.width ?? 0) / 2;
    const halfScreenHeight = (bounds()?.height ?? 0) / 2;
    const roomWidth = store.room.width * ROOM_TILE_SIZE;
    const roomHeight = store.room.height * ROOM_TILE_SIZE;
    let x =
      -(position?.x ?? 0) * ROOM_TILE_SIZE +
      halfScreenWidth -
      ROOM_TILE_SIZE / 2;
    let y =
      -(position?.y ?? 0) * ROOM_TILE_SIZE +
      halfScreenHeight -
      ROOM_TILE_SIZE / 2;

    if (x > 0) {
      x = 0;
    } else if (x < -roomWidth + (bounds()?.width ?? 0)) {
      x = -roomWidth + (bounds()?.width ?? 0);
    }
    if (y > 0) {
      y = 0;
    } else if (y < -roomHeight + (bounds()?.height ?? 0)) {
      y = -roomHeight + (bounds()?.height ?? 0);
    }

    if (roomWidth < (bounds()?.width ?? 0)) {
      x = 0;
    }
    if (roomHeight < (bounds()?.height ?? 0)) {
      y = 0;
    }

    return { x: Math.round(x), y: Math.round(y) };
  });

  return (
    <>
      {store.room && (
        <div ref={ref} onClick={move} class="w-full h-full overflow-hidden">
          <div
            class="relative"
            style={{
              width: `${store.room.width * ROOM_TILE_SIZE}px`,
              height: `${store.room.height * ROOM_TILE_SIZE}px`,
              transform: `translate(${offset().x}px, ${offset().y}px)`,
            }}
          >
            <For each={store.room.backgroundElements}>
              {(backgroundElement) => (
                <RoomBackgroundElementView
                  backgroundElement={backgroundElement}
                />
              )}
            </For>
            <For each={Object.values(store.room.objects)}>
              {(object) => object != null && <ObjectView object={object} />}
            </For>
          </div>
        </div>
      )}
    </>
  );
}
