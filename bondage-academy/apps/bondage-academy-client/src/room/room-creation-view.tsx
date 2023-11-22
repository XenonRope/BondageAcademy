import {
  ROOM_DESCRIPTION_MAX_LENGHT,
  ROOM_NAME_MAX_LENGHT,
  RoomCode,
} from "@bondage-academy/bondage-academy-model";
import { createSignal } from "solid-js";
import { roomService, t } from "../app/services";
import Button from "../ui/button";
import Label from "../ui/label";
import SelectInput from "../ui/select-input";
import SelectOption from "../ui/select-option";
import TextInput from "../ui/text-input";
import Textarea from "../ui/textarea";

export default function RoomCreationView(props: { onCancel?: () => void }) {
  const [template, setTemplate] = createSignal<string | undefined>(undefined);
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");

  function createRoom() {
    const roomCode = template();
    if (!roomCode) {
      return;
    }

    roomService
      .createRoom({
        roomCode,
        name: name(),
        description: description(),
        publicRoom: true,
      })
      .catch(console.log);
  }

  return (
    <div class="p-2">
      <div class="text-lg font-bold mb-2">{t("common.createRoom")}</div>
      <div class="mb-4">
        <Label for="room_template">{t("roomCreation.template")}</Label>
        <SelectInput
          id="room_template"
          value={template()}
          onChange={setTemplate}
        >
          <SelectOption value={RoomCode.PrisonCell}>
            {t("rooms.prisonCell")}
          </SelectOption>
        </SelectInput>
      </div>
      <div class="mb-4">
        <Label for="room_name">{t("roomCreation.name")}</Label>
        <TextInput
          id="room_name"
          value={name()}
          onInput={setName}
          maxLength={ROOM_NAME_MAX_LENGHT}
        />
      </div>
      <div class="mb-4">
        <Label for="room_description">{t("roomCreation.description")}</Label>
        <Textarea
          id="room_description"
          value={description()}
          onInput={setDescription}
          maxLength={ROOM_DESCRIPTION_MAX_LENGHT}
        />
      </div>
      <div class="flex gap-2">
        <Button onClick={createRoom}>{t("common.createRoom")}</Button>
        <Button onClick={props.onCancel}>{t("common.back")}</Button>
      </div>
    </div>
  );
}
