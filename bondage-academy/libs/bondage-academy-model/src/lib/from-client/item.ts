import * as t from "io-ts";

export const WearRequestSchema = t.type({
  itemCode: t.string,
});

export type WearRequest = t.TypeOf<typeof WearRequestSchema>;
