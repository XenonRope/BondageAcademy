import { RoomCode } from "@bondage-academy/bondage-academy-model";
import { For, Show, createResource, createSignal } from "solid-js";
import { roomService, t } from "../app/services";
import Button from "../ui/button";
import Label from "../ui/label";
import TextInput from "../ui/text-input";
import RoomCreationView from "./room-creation-view";
import RoomSearchDetailsView from "./room-search-details-view";

export default function RoomSelectionView() {
  const [name, setName] = createSignal("");
  const [creatingRoom, setCreatingRoom] = createSignal(false);
  const [searchResult] = createResource(name, (name) =>
    roomService.searchRooms({ name, skip: 0, limit: 20 })
  );

  function createPrivateRoom(roomCode: RoomCode) {
    roomService.createRoom({ roomCode, publicRoom: false }).catch(console.log);
  }

  function jointRoom(roomId: number) {
    roomService.joinRoom(roomId).catch(console.log);
  }

  function startCreatingRoom() {
    setCreatingRoom(true);
  }

  return (
    <>
      <Show when={!creatingRoom()}>
        <div class="flex flex-col h-full p-2">
          <div>
            <div class="text-lg font-bold mb-2">
              {t("common.exploreAcademy")}
            </div>
            <div class="flex gap-2 mb-2">
              <Button onClick={() => createPrivateRoom(RoomCode.Introduction)}>
                {t("rooms.introduction")}
              </Button>
              <Button onClick={() => createPrivateRoom(RoomCode.PrisonCell)}>
                {t("rooms.prisonCell")}
              </Button>
            </div>
          </div>
          <div class="flex flex-col min-h-0">
            <div class="text-lg font-bold mb-2">{t("common.publicRooms")}</div>
            <div class="mb-2">
              <Button onClick={startCreatingRoom}>
                {t("common.createRoom")}
              </Button>
            </div>
            <div class="mb-3">
              <Label for="room_name">{t("common.roomName")}</Label>
              <TextInput id="room_name" value={name()} onInput={setName} />
            </div>
            <div class="grid grid-cols-1 2xl:grid-cols-2 min-h-0 gap-2 overflow-y-auto">
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
      </Show>
      <Show when={creatingRoom()}>
        <RoomCreationView onCancel={() => setCreatingRoom(false)} />
      </Show>
    </>
  );
}
