import CharacterView from "../character/CharacterView";
import ChatView from "../chat/ChatView";
import { storeService } from "../store/StoreService";
import WorldView from "../world/WorldView";
import SideMenuBar from "./SideMenuBar";
import SideMenuPanel from "./SideMenuPanel";

export default function GamePage() {
  const store = storeService.getStore();

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
                <CharacterView character={store.player.character} />
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
