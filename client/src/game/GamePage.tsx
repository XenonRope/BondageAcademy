import CharacterView from "../character/CharacterView";
import { store } from "../common/Store";
import WorldView from "../world/WorldView";

export default function GamePage() {
  return (
    <div class="h-full">
      <div class="h-full flex">
        <div class="flex-grow">
          {store.world != null && <WorldView world={store.world} />}
        </div>
        <div class="w-[600px]">
          {store.player?.character != null && (
            <CharacterView character={store.player.character} />
          )}
        </div>
      </div>
    </div>
  );
}
