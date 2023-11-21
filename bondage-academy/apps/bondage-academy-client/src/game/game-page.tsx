import {
  Character,
  isNPCObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { Show } from "solid-js";
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
    <div class="h-full overflow-hidden bg-primary-800">
      <div class="flex h-full">
        <div class="flex-none m-[3px] mr-0">
          <SideMenuBar />
        </div>
        <div class="flex-grow min-w-0">
          <div class="relative flex h-full">
            <div class="w-[50%] m-[3px] mr-0 bg-primary-50">
              {store.room != null ? <RoomView /> : <RoomSelectionView />}
            </div>
            <div class="w-[25%] m-[3px] mr-0 bg-primary-50">
              <CharacterGridView characters={getCharacters()} />
            </div>
            <div class="w-[25%] m-[3px] bg-primary-50">
              <ChatView />
            </div>
            <Show when={store.sideMenuView != null}>
              <div class="absolute h-full border-[3px] border-primary-800">
                <SideMenuPanel />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
