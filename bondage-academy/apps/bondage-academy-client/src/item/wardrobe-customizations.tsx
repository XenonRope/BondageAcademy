import {
  ItemCode,
  ItemCustomization,
} from "@bondage-academy/bondage-academy-model";
import { For } from "solid-js";
import { SetStoreFunction, produce } from "solid-js/store";
import WardrobeCustomizationFragment from "./wardrobe-customization-fragment";

export default function WardrobeCustomizations(props: {
  customizations: ItemCustomization[];
  setCustomizations: SetStoreFunction<ItemCustomization[]>;
  itemCode: ItemCode;
  onCustomizationsChange?: () => void;
}) {
  return (
    <div class="flex flex-col gap-1">
      <For each={props.customizations}>
        {(customization, index) => (
          <WardrobeCustomizationFragment
            customization={customization}
            showFragmentName={props.customizations.length > 1}
            itemCode={props.itemCode}
            onColorInput={(color) =>
              props.setCustomizations(
                produce(
                  (customizations) => (customizations[index()].color = color),
                ),
              )
            }
            onColorChange={props.onCustomizationsChange}
            onTextureChange={(texture) => {
              props.setCustomizations(
                produce(
                  (customizations) =>
                    (customizations[index()].texture = texture),
                ),
              );
              props.onCustomizationsChange?.();
            }}
          />
        )}
      </For>
    </div>
  );
}
