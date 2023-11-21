import { RoomSearchDetails } from "@bondage-academy/bondage-academy-model";
import { t } from "../app/services";
import { DictionaryKey } from "../locale/services/locale-service";
import { usersIcon } from "../ui/icons";

export default function RoomSearchDetailsView(props: {
  room: RoomSearchDetails;
  onClick?: () => void;
}) {
  return (
    <div
      class="h-8 font-medium border-[3px] border-primary-800 bg-primary-100 hover:bg-primary-200"
      onClick={props.onClick}
    >
      <div class="flex px-1">
        <div>
          {props.room.name
            ? (t(props.room.name as DictionaryKey) as string)
            : props.room.customName}
        </div>
        <div class="flex items-center ml-auto">
          <div class="h-4 w-4 mr-1">{usersIcon()}</div>
          <div>{props.room.playersCount}</div>
        </div>
      </div>
    </div>
  );
}
