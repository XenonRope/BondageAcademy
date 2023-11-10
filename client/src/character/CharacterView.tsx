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
    <div class="relative h-[800px] w-[600px] overflow-hidden bg-gray-100">
      <For each={getLayers()}>
        {(layer) => (
          <div
            class="absolute h-full w-full"
            style={{
              top: `${layer.offsetY ?? 0}px`,
              "background-image": `url("${layer.url}")`,
            }}
          />
        )}
      </For>
    </div>
  );
}
