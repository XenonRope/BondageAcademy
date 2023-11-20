import { RoomCode } from "@bondage-academy/bondage-academy-model";
import { For, createResource, createSignal } from "solid-js";
import { roomService, t } from "../app/services";
import { DictionaryKey } from "../locale/services/locale-service";
import Button from "../ui/button";
import Label from "../ui/label";
import TextInput from "../ui/text-input";

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
        <div>
          <Label for="room_name">{t("common.roomName")}</Label>
          <TextInput id="room_name" value={name()} onInput={setName} />
        </div>
        <div>
          <For each={searchResult()?.rooms}>
            {(room) => (
              <div>
                <Button onClick={() => jointRoom(room.id)}>
                  {room.name
                    ? (t(room.name as DictionaryKey) as string)
                    : room.customName}
                </Button>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
