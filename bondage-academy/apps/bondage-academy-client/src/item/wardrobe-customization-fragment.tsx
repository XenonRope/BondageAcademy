import {
  Color,
  DictionaryKey,
  ItemCode,
  ItemCustomization,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { Show, createMemo } from "solid-js";
import { t } from "../app/services";
import Button from "../ui/button";
import ColorPicker from "../ui/color-picker";

export default function WardrobeCustomizationFragment(props: {
  customization: ItemCustomization;
  showFragmentName: boolean;
  itemCode: ItemCode;
  onColorInput?: (color?: Color) => void;
  onColorChange?: (color?: Color) => void;
  onTextureChange?: (texture?: DictionaryKey) => void;
}) {
  const getTextures = createMemo<Array<string | undefined>>(() => {
    const textures =
      itemConfigs[props.itemCode].fragments
        .find((fragment) => fragment.name === props.customization.fragmentName)
        ?.textures?.map((texture) => texture.name) ?? [];

    return [undefined, ...textures];
  });

  function getNextTexture(): DictionaryKey | undefined {
    const index = getTextures().indexOf(props.customization.texture);
    return index < getTextures().length - 1
      ? (getTextures()[index + 1] as DictionaryKey)
      : undefined;
  }

  return (
    <div class="flex items-center">
      <Show when={props.showFragmentName}>
        <div class="w-20 mr-2 font-medium">
          {t(props.customization.fragmentName as DictionaryKey)}
        </div>
      </Show>
      <ColorPicker
        color={props.customization.color}
        onInput={props.onColorInput}
        onChange={props.onColorChange}
      />
      <Show when={getTextures().length > 1}>
        <div class="ml-2">
          <Button
            onClick={() => props.onTextureChange?.(getNextTexture())}
            size="small"
            class="w-20"
          >
            {t(
              (props.customization.texture ??
                "textures.default") as DictionaryKey,
            )}
          </Button>
        </div>
      </Show>
    </div>
  );
}
