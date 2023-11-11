import { For } from "solid-js";
import type { Character } from "./model/Character";
import {
  characterLayerService,
  type CharacterLayer,
} from "./service/CharacterLayerService";

export default function CharacterView(props: { character: Character }) {
  function getLayers(): CharacterLayer[] {
    return characterLayerService.getCharacterLayers(props.character);
  }

  return (
    <div class="aspect-[3/4] overflow-hidden bg-gray-100">
      <div class="relative h-[800px] w-[600px] origin-top-left scale-[0.166666]">
        <For each={getLayers()}>
          {(layer) => (
            <div
              class="absolute h-[800px] w-[600px]"
              style={{
                top: `${layer.offsetY ?? 0}px`,
                "background-image": `url("${layer.url}")`,
              }}
            />
          )}
        </For>
      </div>
    </div>
  );
}
