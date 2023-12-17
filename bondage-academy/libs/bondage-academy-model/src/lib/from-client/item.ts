import * as t from "io-ts";
import { ItemCustomization } from "../model/character";
import { Slot } from "../model/slot";
import { TypeUtils } from "../utils/type-utils";

export const WearRequestSchema = t.type({
  targetPlayerId: t.number,
  slot: TypeUtils.fromEnum(Slot),
  itemId: t.union([t.number, t.undefined]),
});

export type WearRequest = t.TypeOf<typeof WearRequestSchema>;

export const CustomizeItemRequest = t.type({
  targetPlayerId: t.number,
  slot: TypeUtils.fromEnum(Slot),
  customizations: t.array(ItemCustomization),
});

export type CustomizeItemRequest = t.TypeOf<typeof CustomizeItemRequest>;
