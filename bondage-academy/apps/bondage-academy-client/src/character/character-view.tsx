import { Character } from "@bondage-academy/bondage-academy-model";
import { trackBounds } from "solid-boundaries";
import { For } from "solid-js";
import { characterLayerService } from "../app/services";
import { ColorUtils } from "../utils/color-utils";
import { CHARACTER_VIEW_HEIGHT, CHARACTER_VIEW_WIDTH } from "./model/character";
import { type CharacterLayer } from "./service/character-layer-service";

export default function CharacterView(props: { character: Character }) {
  const { ref, bounds } = trackBounds();

  function getLayers(): CharacterLayer[] {
    return characterLayerService.getCharacterLayers(props.character);
  }

  function getScale(): number {
    return (bounds()?.width ?? 0) / CHARACTER_VIEW_WIDTH;
  }

  return (
    <div
      ref={ref}
      class="max-h-full overflow-hidden"
      style={{
        "aspect-ratio": `${CHARACTER_VIEW_WIDTH}/${CHARACTER_VIEW_HEIGHT}`,
      }}
    >
      <div
        class="relative origin-top-left"
        style={{
          width: `${CHARACTER_VIEW_WIDTH}px`,
          height: `${CHARACTER_VIEW_HEIGHT}px`,
          transform: `scale(${getScale()})`,
        }}
      >
        <For each={getLayers()}>
          {(layer) => (
            <div
              class="absolute"
              style={{
                width: `${CHARACTER_VIEW_WIDTH}px`,
                height: `${CHARACTER_VIEW_HEIGHT}px`,
                top: `${layer.offsetY ?? 0}px`,
                "background-image": `url("${layer.url}")`,
                ...(layer.color
                  ? {
                      "mask-image": `url("${layer.url}")`,
                      "background-blend-mode": "multiply",
                      "background-color": ColorUtils.colorToHex(layer.color),
                    }
                  : {}),
              }}
            />
          )}
        </For>
      </div>
    </div>
  );
}
