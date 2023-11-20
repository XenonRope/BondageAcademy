import { RoomCode } from "@bondage-academy/bondage-academy-model";
import { roomService, t } from "../app/services";
import Button from "../ui/button";

export default function RoomSelectionView() {
  function createRoom(roomCode: RoomCode) {
    roomService.createRoom(roomCode).catch(console.log);
  }

  return (
    <div>
      <Button onClick={() => createRoom(RoomCode.Introduction)}>
        {t("rooms.introduction")}
      </Button>
      <Button onClick={() => createRoom(RoomCode.PrisonCell)}>
        {t("rooms.prisonCell")}
      </Button>
    </div>
  );
}
