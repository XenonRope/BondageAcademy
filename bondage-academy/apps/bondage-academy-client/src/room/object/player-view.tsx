import {
  ActorType,
  PlayerObject,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { JSX, createMemo } from "solid-js";
import { store, storeService } from "../../app/services";
import { ROOM_TILE_SIZE } from "../model/room";

export default function PlayerView(props: { object: PlayerObject }) {
  const selected = createMemo(
    () =>
      isPlayerActor(store.selectedActor) &&
      store.selectedActor.playerId === props.object.playerId
  );

  function selectPlayer(event: MouseEvent) {
    event.stopPropagation();
    if (selected()) {
      storeService.selectActor(undefined);
    } else {
      storeService.selectActor({
        type: ActorType.Player,
        playerId: props.object.playerId,
      });
    }
  }

  function render(): JSX.Element {
    const position = storeService.getPositionByObjectId(props.object.id);
    if (!position) {
      return <></>;
    }

    return (
      <div
        onClick={(event) => event.stopPropagation()}
        onMouseDown={selectPlayer}
        class="absolute rounded-[50%] bg-red-400"
        classList={{ "border-[3px] border-red-800": selected() }}
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
