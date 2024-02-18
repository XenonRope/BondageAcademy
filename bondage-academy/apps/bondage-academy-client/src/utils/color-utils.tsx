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

  static hexToColor(s: string): Color | undefined {
    if (!s.startsWith("#") || s.length != 7) {
      return;
    }
    const r = parseInt(s.slice(1, 3), 16);
    const g = parseInt(s.slice(3, 5), 16);
    const b = parseInt(s.slice(5, 7), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return;
    }
    return { r, g, b };
  }

  static areColorsEqual(
    first: Color | undefined,
    second: Color | undefined,
  ): boolean {
    if (first === second) {
      return true;
    }
    if (!first || !second) {
      return false;
    }
    return first.r === second.r && first.g === second.g && first.b === second.b;
  }
}
