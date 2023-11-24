import * as t from "io-ts";

export const WearRequestSchema = t.type({
  slot: t.string,
  itemId: t.number,
});

export type WearRequest = t.TypeOf<typeof WearRequestSchema>;
