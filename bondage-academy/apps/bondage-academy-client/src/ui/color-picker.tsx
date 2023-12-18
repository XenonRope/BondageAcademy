import { Color } from "@bondage-academy/bondage-academy-model";
import Alwan from "alwan";
import "alwan/dist/css/alwan.min.css";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { ColorUtils } from "../utils/color-utils";
import TextInput from "./text-input";

export default function ColorPicker(props: {
  color?: Color;
  onInput?: (color: Color) => void;
}) {
  const [color, setColor] = createSignal<Color | undefined>();

  let colorPicker: HTMLDivElement | undefined;
  let alwan: Alwan | undefined;

  onMount(() => {
    if (!colorPicker) {
      return;
    }
    alwan = new Alwan(colorPicker, { opacity: false });
    alwan.on("color", (event) => {
      const rgb: Color = { r: event.r, g: event.g, b: event.b };
      setColor(rgb);
      props.onInput?.(rgb);
    });
  });

  createEffect(() => {
    setColor(props.color);
    alwan?.setColor(props.color ?? { r: 0, g: 0, b: 0 });
  });

  const colorAsString = createMemo(() => {
    const rgb = color();
    return rgb ? ColorUtils.colorToHex(rgb) : "";
  });

  return (
    <div class="flex items-center">
      <div ref={colorPicker}></div>
      <div class="w-20 ml-2">
        <TextInput value={colorAsString()} size="small" maxLength={7} />
      </div>
    </div>
  );
}
