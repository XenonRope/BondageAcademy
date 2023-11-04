import { For, createEffect, type JSX } from "solid-js";
import Character from "../character/Character";
import { isPlayerObject } from "./model/PlayerObject";
import type { World } from "./model/World";
import type { WorldObject } from "./model/WorldObject";

export default function WorldView(props: { world: World }) {
  createEffect(() => console.log(props.world.objects));

  function renderObject(object: WorldObject): JSX.Element {
    if (isPlayerObject(object)) {
      return (
        <Character x={object.position.x * 48} y={object.position.y * 48} />
      );
    }
    return <></>;
  }

  return (
    <div class="relative w-full h-full overflow-hidden">
      <For each={[...props.world.objects]}>{renderObject}</For>
    </div>
  );
}
