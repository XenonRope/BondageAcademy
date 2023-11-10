import { For } from "solid-js";
import type { Character } from "./model/Character";
import { characterLayerService } from "./service/CharacterLayerService";

interface CharacterLayer {
  url: string;
  order: number;
  yOffset?: number;
}

export default function CharacterView(props: { character: Character }) {
  function getLayers(): CharacterLayer[] {
    return characterLayerService.getCharacterLayers(props.character);
  }

  return (
    <div class="relative h-[800px] w-[600px] bg-gray-100">
      <For each={getLayers()}>
        {(layer) => (
          <div
            class="absolute h-full w-full"
            style={{
              "background-image": `url("${layer.url}")`,
            }}
          />
        )}
      </For>
    </div>
  );
}
