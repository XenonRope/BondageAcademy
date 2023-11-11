import { createMemo } from "solid-js";
import type { BlockObject } from "../model/BlockObject";
import { BlockColor } from "../model/BlockObject";
import { WORLD_TILE_SIZE } from "../model/World";

export default function BlockView(props: { object: BlockObject }) {
  const color = createMemo(() => {
    if (props.object.color === BlockColor.Green) {
      return "bg-green-400";
    } else {
      return "bg-red-400";
    }
  });

  return (
    <div
      class={`absolute ${color()}`}
      style={{
        width: `${WORLD_TILE_SIZE}px`,
        height: `${WORLD_TILE_SIZE}px`,
        left: `${props.object.position.x * 48}px`,
        top: `${props.object.position.y * 48}px`,
      }}
    />
  );
}
