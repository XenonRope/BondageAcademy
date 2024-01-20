import {
  RoomBackgroundElement,
  RoomBackgroundElementImage,
} from "@bondage-academy/bondage-academy-model";
import { ROOM_TILE_SIZE } from "./model/room";

export default function RoomBackgroundElementView(props: {
  backgroundElement: RoomBackgroundElement;
}) {
  return (
    <div
      class="absolute"
      classList={{
        "bg-green-100":
          props.backgroundElement.image === RoomBackgroundElementImage.Grass,
        "bg-yellow-100":
          props.backgroundElement.image === RoomBackgroundElementImage.Road,
      }}
      style={{
        width: `${props.backgroundElement.width * ROOM_TILE_SIZE}px`,
        height: `${props.backgroundElement.height * ROOM_TILE_SIZE}px`,
        transform: `translate(${
          props.backgroundElement.x * ROOM_TILE_SIZE
        }px, ${props.backgroundElement.y * ROOM_TILE_SIZE}px)`,
      }}
    ></div>
  );
}
