import {
  Character,
  isNPCObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { npcCharacterService, store } from "../app/services";
import CharacterGridView from "../character/character-grid-view";
import ChatView from "../chat/chat-view";
import RoomSelectionView from "../room/room-selection-view";
import RoomView from "../room/room-view";
import SideMenuBar from "./side-menu-bar";
import SideMenuPanel from "./side-menu-panel";

export default function GamePage() {
  function getCharacters(): Character[] {
    if (store.room) {
      return [...getPlayerCharacters(), ...getNPCCharacters()];
    }

    const player = store.players?.find(
      (player) => player.id === store.playerId
    );
    if (player) {
      return [player.character];
    }

    return [];
  }

  function getPlayerCharacters(): Character[] {
    return (
      store.room?.objects
        .flatMap((object) => (isPlayerObject(object) ? [object.playerId] : []))
        .map((playerId) =>
          store.players?.find((player) => player.id === playerId)
        )
        .flatMap((player) => (player ? [player.character] : [])) ?? []
    );
  }

  function getNPCCharacters(): Character[] {
    return (
      store.room?.objects
        .flatMap((object) => (isNPCObject(object) ? [object.code] : []))
        .map((npcCode) => npcCharacterService.getCharacterByNPCCode(npcCode)) ??
      []
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
              {store.room != null ? <RoomView /> : <RoomSelectionView />}
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
