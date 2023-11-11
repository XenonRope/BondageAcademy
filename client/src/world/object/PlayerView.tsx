import { createMemo } from "solid-js";
import type { PlayerObject } from "../model/PlayerObject";
import { WORLD_TILE_SIZE } from "../model/World";

export default function PlayerView(props: { object: PlayerObject }) {
  const position = createMemo(
    () => props.object.motion?.currentPosition ?? props.object.position,
  );

  return (
    <div
      class="absolute rounded-[50%] bg-red-400"
      style={{
        width: `${WORLD_TILE_SIZE}px`,
        height: `${WORLD_TILE_SIZE}px`,
        left: `${position().x * 48}px`,
        top: `${position().y * 48}px`,
      }}
    />
  );
}
