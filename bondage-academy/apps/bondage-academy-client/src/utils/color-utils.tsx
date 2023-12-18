import { Color } from "@bondage-academy/bondage-academy-model";

export class ColorUtils {
  static numberToHex(n: number): string {
    const hex = n.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static colorToHex({ r, g, b }: Color): string {
    return (
      "#" +
      ColorUtils.numberToHex(r) +
      ColorUtils.numberToHex(g) +
      ColorUtils.numberToHex(b)
    );
  }
}
