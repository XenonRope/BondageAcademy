import CharacterView from "../character/CharacterView";
import ChatView from "../chat/ChatView";
import { store } from "../common/Store";
import WorldView from "../world/WorldView";

export default function GamePage() {
  return (
    <div class="h-full overflow-hidden">
      <div class="h-full flex">
        <div class="w-[48px] bg-gray-100" />
        <div class="flex-grow">
          {store.world != null && <WorldView world={store.world} />}
        </div>
        <div class="w-[100px]">
          {store.player?.character != null && (
            <CharacterView character={store.player.character} />
          )}
        </div>
        <div class="w-[100px]">
          <ChatView />
        </div>
      </div>
    </div>
  );
}
