import {
  ActorType,
  NPCObject,
  isNPCActor,
} from "@bondage-academy/bondage-academy-model";
import { createMemo } from "solid-js";
import { store, storeService } from "../../app/services";
import { ROOM_TILE_SIZE } from "../model/room";

export default function NPCView(props: { object: NPCObject }) {
  const selected = createMemo(
    () =>
      isNPCActor(store.selectedActor) &&
      store.selectedActor.objectId === props.object.id &&
      store.selectedActor.roomId === store.room?.id
  );

  function selectNPC(event: MouseEvent) {
    event.stopPropagation();
    if (selected()) {
      storeService.selectActor(undefined);
    } else {
      const roomId = store.room?.id;
      if (roomId) {
        storeService.selectActor({
          type: ActorType.NPC,
          objectId: props.object.id,
          roomId,
        });
      }
    }
  }

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onMouseDown={selectNPC}
      class="absolute rounded-[50%] bg-green-400"
      classList={{ "border-[3px] border-green-800": selected() }}
      style={{
        width: `${ROOM_TILE_SIZE}px`,
        height: `${ROOM_TILE_SIZE}px`,
        transform: `translate(${props.object.position.x * ROOM_TILE_SIZE}px, ${
          props.object.position.y * ROOM_TILE_SIZE
        }px)`,
      }}
    />
  );
}
