import { For } from "solid-js";
import { socketService } from "../common/SocketService";
import type { Position } from "../common/model/Position";
import type { World } from "./model/World";
import { ObjectView } from "./objects/ObjectVIew";

export default function WorldView(props: { world: World }) {
  async function move(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    const rect = event.currentTarget?.getBoundingClientRect();
    const targetPosition: Position = {
      x: Math.floor((event.clientX - rect.left) / 48),
      y: Math.floor((event.clientY - rect.top) / 48),
    };
    await socketService.emit("set_player_target_position", targetPosition);
  }

  return (
    <div onClick={move} class="relative w-full h-full overflow-hidden">
      <For each={Object.values(props.world.objects)}>
        {(object) => <ObjectView object={object} />}
      </For>
    </div>
  );
}
