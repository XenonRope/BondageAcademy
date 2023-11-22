import * as t from "io-ts";

export const SpeakRequestSchema = t.type({
  content: t.string,
});

export type SpeakRequest = t.TypeOf<typeof SpeakRequestSchema>;
