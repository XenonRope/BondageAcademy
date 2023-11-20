import { Room } from "@bondage-academy/bondage-academy-model";
import { trackBounds } from "solid-boundaries";
import { For, createMemo } from "solid-js";
import { socketService, storeService } from "../app/services";
import { ROOM_TILE_SIZE } from "./model/room";
import ObjectView from "./object/object-view";

export default function RoomView(props: { room: Room }) {
  const { ref, bounds } = trackBounds();

  function move(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    const rect = event.currentTarget?.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - offset().x) / 48);
    const y = Math.floor((event.clientY - rect.top - offset().y) / 48);
    if (x >= 0 && x < props.room.width && y >= 0 && y < props.room.height) {
      socketService
        .emit("set_player_target_position", { x, y })
        .catch(console.log);
    }
  }

  const offset = createMemo(() => {
    const position = storeService.getPlayerPosition();

    const halfScreenWidth = (bounds()?.width ?? 0) / 2;
    const halfScreenHeight = (bounds()?.height ?? 0) / 2;
    const roomWidth = props.room.width * ROOM_TILE_SIZE;
    const roomHeight = props.room.height * ROOM_TILE_SIZE;
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

    return { x, y };
  });

  return (
    <div ref={ref} onClick={move} class="w-full h-full overflow-hidden">
      <div
        class="relative bg-green-100"
        style={{
          width: `${props.room.width * ROOM_TILE_SIZE}px`,
          height: `${props.room.height * ROOM_TILE_SIZE}px`,
          transform: `translate(${offset().x}px, ${offset().y}px)`,
        }}
      >
        <For each={Object.values(props.room.objects)}>
          {(object) => object != null && <ObjectView object={object} />}
        </For>
      </div>
    </div>
  );
}
