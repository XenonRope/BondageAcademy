import {
  Character,
  isNPCObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { Show, createMemo } from "solid-js";
import { npcCharacterService, store, storeService } from "../app/services";
import CharacterGridView from "../character/character-grid-view";
import ChatView from "../chat/chat-view";
import MinigameView from "../minigame/minigame-view";
import RoomSelectionView from "../room/room-selection-view";
import RoomView from "../room/room-view";
import ActionMenuBar from "./action-menu-bar";
import ActionMenuPanel from "./action-menu-panel";
import SideMenuBar from "./side-menu-bar";
import SideMenuPanel from "./side-menu-panel";

export default function GamePage() {
  const minigame = createMemo(() => storeService.getMinigame());

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
    <div class="relative h-full overflow-hidden bg-primary-800">
      <div class="flex h-full">
        <div class="flex-none m-[3px] mr-0">
          <SideMenuBar />
        </div>
        <div class="flex-grow min-w-0">
          <div class="relative flex h-full gap-[3px] p-[3px]">
            <Show when={!store.room}>
              <div class="flex-[2] min-w-0 bg-primary-50">
                <RoomSelectionView />
              </div>
              <div class="flex-1 min-w-0 bg-primary-50">
                <CharacterGridView characters={getCharacters()} />
              </div>
              <div class="flex-1 min-w-0 bg-primary-50">
                <ChatView />
              </div>
            </Show>
            <Show when={store.room}>
              <div class="flex flex-col flex-[3] min-w-0 gap-[3px]">
                <div class="flex-1 min-h-0 bg-primary-50">
                  <RoomView />
                </div>
                <div class="flex-1 min-h-0 bg-primary-50">
                  <CharacterGridView characters={getCharacters()} />
                </div>
              </div>
              <div class="flex-1 min-w-0 bg-primary-50">
                <ChatView />
              </div>
            </Show>
            <Show when={store.sideMenuView != null}>
              <div class="absolute top-[3px] bottom-[3px] border-r-[3px] border-primary-800">
                <SideMenuPanel />
              </div>
            </Show>
            <Show when={store.actionMenuView != null}>
              <div class="absolute top-[3px] bottom-[3px] right-[3px] border-l-[3px] border-primary-800">
                <ActionMenuPanel />
              </div>
            </Show>
          </div>
        </div>
        <div class="flex-none m-[3px] ml-0">
          <ActionMenuBar />
        </div>
      </div>
      <Show when={minigame()}>
        {(minigame) => (
          <div class="fixed top-0 left-0 w-full h-full">
            <MinigameView minigame={minigame()} />
          </div>
        )}
      </Show>
    </div>
  );
}
