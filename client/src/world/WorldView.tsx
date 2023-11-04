import { For, type JSX } from "solid-js";
import Character from "../character/Character";
import { socketService } from "../common/SocketService";
import type { Position } from "../common/model/Position";
import { isPlayerObject } from "./model/PlayerObject";
import type { World } from "./model/World";
import type { WorldObject } from "./model/WorldObject";

export default function WorldView(props: { world: World }) {
  function renderObject(object: WorldObject): JSX.Element {
    if (isPlayerObject(object)) {
      return (
        <Character x={object.position.x * 48} y={object.position.y * 48} />
      );
    }
    return <></>;
  }

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
      <For each={Object.values(props.world.objects)}>{renderObject}</For>
    </div>
  );
}
