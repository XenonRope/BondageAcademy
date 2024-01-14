import * as t from "io-ts";
import { Actor } from "../model/actor";
import { ItemCustomization } from "../model/character";
import { ItemReference, PhantomItem } from "../model/item";
import { Slot } from "../model/slot";
import { TypeUtils } from "../utils/type-utils";

export const WearRequestSchema = t.type({
  target: Actor,
  slot: TypeUtils.fromEnum(Slot),
  item: t.union([ItemReference, PhantomItem, t.undefined]),
});

export type WearRequest = t.TypeOf<typeof WearRequestSchema>;

export const CustomizeItemRequest = t.type({
  target: Actor,
  slot: TypeUtils.fromEnum(Slot),
  customizations: t.array(ItemCustomization),
});

export type CustomizeItemRequest = t.TypeOf<typeof CustomizeItemRequest>;
