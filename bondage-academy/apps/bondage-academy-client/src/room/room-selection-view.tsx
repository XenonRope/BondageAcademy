import { RoomCode } from "@bondage-academy/bondage-academy-model";
import { For, createResource, createSignal } from "solid-js";
import { roomService, t } from "../app/services";
import Button from "../ui/button";
import Label from "../ui/label";
import TextInput from "../ui/text-input";
import RoomSearchDetailsView from "./room-search-details-view";

export default function RoomSelectionView() {
  const [name, setName] = createSignal("");
  const [searchResult] = createResource(name, (name) =>
    roomService.searchRooms({ name })
  );

  function createRoom(roomCode: RoomCode) {
    roomService.createRoom(roomCode).catch(console.log);
  }

  function jointRoom(roomId: number) {
    roomService.joinRoom(roomId).catch(console.log);
  }

  return (
    <div class="p-2">
      <div>
        <div class="mb-2">
          <Button onClick={() => createRoom(RoomCode.Introduction)}>
            {t("rooms.introduction")}
          </Button>
        </div>
        <div class="mb-2">
          <Button onClick={() => createRoom(RoomCode.PrisonCell)}>
            {t("rooms.prisonCell")}
          </Button>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <Label for="room_name">{t("common.roomName")}</Label>
          <TextInput id="room_name" value={name()} onInput={setName} />
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:lg:grid-cols-3 gap-2">
          <For each={searchResult()?.rooms}>
            {(room) => (
              <RoomSearchDetailsView
                room={room}
                onClick={() => jointRoom(room.id)}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
