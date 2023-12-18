import * as t from "io-ts";

export interface ColortPartBrand {
  readonly ColorPart: unique symbol;
}

export const ColorPart = t.refinement(t.Integer, (n) => n >= 0 && n <= 255);

export const Color = t.type({
  r: ColorPart,
  g: ColorPart,
  b: ColorPart,
});

export type Color = t.TypeOf<typeof Color>;
