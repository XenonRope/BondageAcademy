import {
  BlockColor,
  BlockObject,
} from "@bondage-academy/bondage-academy-model";
import { createMemo } from "solid-js";
import { ROOM_TILE_SIZE } from "../model/room";

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
        width: `${ROOM_TILE_SIZE}px`,
        height: `${ROOM_TILE_SIZE}px`,
        left: `${props.object.position.x * ROOM_TILE_SIZE}px`,
        top: `${props.object.position.y * ROOM_TILE_SIZE}px`,
      }}
    />
  );
}
