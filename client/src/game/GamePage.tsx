import { store } from "../app/services";
import CharacterGridView from "../character/CharacterGridView";
import type { Character } from "../character/model/Character";
import ChatView from "../chat/ChatView";
import WorldView from "../world/WorldView";
import { isPlayerObject } from "../world/model/PlayerObject";
import SideMenuBar from "./SideMenuBar";
import SideMenuPanel from "./SideMenuPanel";

export default function GamePage() {
  function getCharacters(): Character[] {
    return Object.values(store.world?.objects ?? {}).flatMap((object) =>
      isPlayerObject(object) ? [object.character] : [],
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
              {store.world != null && <WorldView world={store.world} />}
            </div>
            <div class="w-[25%]">
              {store.player?.character != null && (
                <CharacterGridView characters={getCharacters()} />
              )}
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
