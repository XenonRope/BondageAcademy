import { Color } from "@bondage-academy/bondage-academy-model";
import Alwan from "alwan";
import "alwan/dist/css/alwan.min.css";
import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import { ColorUtils } from "../utils/color-utils";
import TextInput from "./text-input";

export default function ColorPicker(props: {
  color?: Color;
  onInput?: (color?: Color) => void;
  onChange?: (color?: Color) => void;
}) {
  const [color, setColor] = createSignal<Color | undefined>();
  const [colorAsHex, setColorAsHex] = createSignal("");

  let colorPicker: HTMLDivElement | undefined;
  let alwan: Alwan | undefined;
  let alwanColorEventIgnored = false;

  onMount(() => {
    if (!colorPicker) {
      return;
    }
    alwan = new Alwan(colorPicker, { opacity: false });
    alwan.on("color", (event) => {
      if (alwanColorEventIgnored) {
        return;
      }
      const newColor: Color = { r: event.r, g: event.g, b: event.b };
      if (ColorUtils.areColorsEqual(newColor, color())) {
        return;
      }
      setColor(newColor);
      setColorAsHex(newColor ? ColorUtils.colorToHex(newColor) : "");
      props.onInput?.(newColor);
    });
    alwan.on("close", () => {
      props.onChange?.(color());
    });
  });

  onCleanup(() => {
    alwan?.destroy();
  });

  createEffect(
    on(
      () => props.color,
      (newColor) => {
        if (ColorUtils.areColorsEqual(newColor, color())) {
          return;
        }
        setColor(newColor);
        setColorAsHex(newColor ? ColorUtils.colorToHex(newColor) : "");
        setAlwanColor(newColor);
      }
    )
  );

  function setAlwanColor(newColor?: Color): void {
    alwanColorEventIgnored = true;
    alwan?.setColor(newColor ?? "");
    alwanColorEventIgnored = false;
  }

  return (
    <div class="flex items-center">
      <div ref={colorPicker}></div>
      <div class="w-20 ml-2">
        <TextInput
          value={colorAsHex()}
          onInput={setColorAsHex}
          onChange={(colorAsHex) => {
            const newColor = ColorUtils.hexToColor(colorAsHex);
            setColorAsHex(newColor ? ColorUtils.colorToHex(newColor) : "");
            if (ColorUtils.areColorsEqual(newColor, color())) {
              return;
            }
            setColor(newColor);
            setAlwanColor(newColor);
            props.onInput?.(newColor);
            props.onChange?.(newColor);
          }}
          size="small"
          maxLength={7}
        />
      </div>
    </div>
  );
}
