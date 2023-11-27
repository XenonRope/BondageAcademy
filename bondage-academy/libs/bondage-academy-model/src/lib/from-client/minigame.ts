import * as t from "io-ts";

export const MinigameProgessRequestSchema = t.type({
  minigameId: t.number,
  progressChange: t.number,
});

export type MinigameProgessRequest = t.TypeOf<
  typeof MinigameProgessRequestSchema
>;
