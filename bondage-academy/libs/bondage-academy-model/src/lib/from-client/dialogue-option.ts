import * as t from "io-ts";

export const UseDialogueOptionRequestSchema = t.type({
  npcCode: t.string,
  content: t.string,
});

export type UseDialogueOptionRequest = t.TypeOf<
  typeof UseDialogueOptionRequestSchema
>;
