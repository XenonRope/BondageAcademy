import { PlayerObject } from "@bondage-academy/bondage-academy-model";
import { JSX } from "solid-js";
import { storeService } from "../../app/services";
import { WORLD_TILE_SIZE } from "../model/world";

export default function PlayerView(props: { object: PlayerObject }) {
  function render(): JSX.Element {
    const position = storeService.getPositionByObjectId(props.object.id);
    if (!position) {
      return <></>;
    }

    return (
      <div
        class="absolute rounded-[50%] bg-red-400"
        style={{
          width: `${WORLD_TILE_SIZE}px`,
          height: `${WORLD_TILE_SIZE}px`,
          left: `${position.x * 48}px`,
          top: `${position.y * 48}px`,
        }}
      />
    );
  }

  return <>{render()}</>;
}
