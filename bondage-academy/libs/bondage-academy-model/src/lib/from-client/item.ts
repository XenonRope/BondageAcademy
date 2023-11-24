import * as t from "io-ts";

export const WearRequestSchema = t.type({
  targetPlayerId: t.number,
  slot: t.string,
  itemId: t.union([t.number, t.undefined]),
});

export type WearRequest = t.TypeOf<typeof WearRequestSchema>;
