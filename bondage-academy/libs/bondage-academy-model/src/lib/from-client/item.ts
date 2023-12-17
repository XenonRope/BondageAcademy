import * as t from "io-ts";
import { ItemCustomizationSchema } from "../model/character";

export const WearRequestSchema = t.type({
  targetPlayerId: t.number,
  slot: t.string,
  itemId: t.union([t.number, t.undefined]),
});

export type WearRequest = t.TypeOf<typeof WearRequestSchema>;

export const CustomizeItemRequestSchema = t.type({
  targetPlayerId: t.number,
  slot: t.string,
  customizations: t.array(ItemCustomizationSchema),
});
