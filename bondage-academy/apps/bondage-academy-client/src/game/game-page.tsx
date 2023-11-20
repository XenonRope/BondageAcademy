import {
  Character,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { store } from "../app/services";
import CharacterGridView from "../character/character-grid-view";
import ChatView from "../chat/chat-view";
import RoomView from "../room/room-view";
import SideMenuBar from "./side-menu-bar";
import SideMenuPanel from "./side-menu-panel";

export default function GamePage() {
  function getCharacters(): Character[] {
    return (
      store.room?.objects
        ?.flatMap((object) => (isPlayerObject(object) ? [object.playerId] : []))
        .map((playerId) =>
          store.players?.find((player) => player.id === playerId)
        )
        .flatMap((player) => (player ? [player.character] : [])) ?? []
    );
  }

  return (
    <div class="h-full overflow-hidden">
      <div class="flex h-full">
        <div class="flex-none">
          <SideMenuBar />
        </div>
        <div class="flex-grow min-w-0">
          <div class="relative flex h-full">
            <div class="w-[50%]">
              {store.room != null && <RoomView room={store.room} />}
            </div>
            <div class="w-[25%]">
              <CharacterGridView characters={getCharacters()} />
            </div>
            <div class="w-[25%]">
              <ChatView />
            </div>
            <SideMenuPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
