import { trackBounds } from "solid-boundaries";
import { For } from "solid-js";
import type { Character } from "./model/Character";
import {
  characterLayerService,
  type CharacterLayer,
} from "./service/CharacterLayerService";

export default function CharacterView(props: { character: Character }) {
  const { ref, bounds } = trackBounds();

  function getLayers(): CharacterLayer[] {
    return characterLayerService.getCharacterLayers(props.character);
  }

  function getScale(): number {
    return (bounds()?.width ?? 0) / 600;
  }

  return (
    <div ref={ref} class="aspect-[3/4] max-h-full overflow-hidden bg-gray-100">
      <div
        class="relative h-[800px] w-[600px] origin-top-left"
        style={{ transform: `scale(${getScale()})` }}
      >
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
