import { PlayerObject } from "@bondage-academy/bondage-academy-model";
import { JSX } from "solid-js";
import { storeService } from "../../app/services";
import { ROOM_TILE_SIZE } from "../model/room";

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
          width: `${ROOM_TILE_SIZE}px`,
          height: `${ROOM_TILE_SIZE}px`,
          left: `${position.x * ROOM_TILE_SIZE}px`,
          top: `${position.y * ROOM_TILE_SIZE}px`,
        }}
      />
    );
  }

  return <>{render()}</>;
}
