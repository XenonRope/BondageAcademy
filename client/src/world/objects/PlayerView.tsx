import { createMemo } from "solid-js";
import type { PlayerObject } from "../model/PlayerObject";

export function PlayerView(props: { object: PlayerObject }) {
  const position = createMemo(
    () => props.object.motion?.currentPosition ?? props.object.position,
  );

  return (
    <div
      class="absolute w-[48px] h-[48px] rounded-[50%] bg-red-400"
      style={{ left: `${position().x * 48}px`, top: `${position().y * 48}px` }}
    />
  );
}
