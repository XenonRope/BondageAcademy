import { NPCObject } from "@bondage-academy/bondage-academy-model";
import { ROOM_TILE_SIZE } from "../model/room";

export default function NPCView(props: { object: NPCObject }) {
  return (
    <div
      class="absolute rounded-[50%] bg-green-400"
      style={{
        width: `${ROOM_TILE_SIZE}px`,
        height: `${ROOM_TILE_SIZE}px`,
        left: `${props.object.position.x * ROOM_TILE_SIZE}px`,
        top: `${props.object.position.y * ROOM_TILE_SIZE}px`,
      }}
    />
  );
}
