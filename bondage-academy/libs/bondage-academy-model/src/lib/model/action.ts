import * as t from "io-ts";
import { TargetSchema } from "./target";

export enum ActionType {
  Smile = "Smile",
  LookAt = "LookAt",
}

export const SmileActionSchema = t.type({
  type: t.literal(ActionType.Smile),
  target: t.union([t.undefined, TargetSchema]),
});

export type SmileAction = t.TypeOf<typeof SmileActionSchema>;

export const LookAtActionSchema = t.type({
  type: t.literal(ActionType.LookAt),
  target: TargetSchema,
});

export type LookAtAction = t.TypeOf<typeof LookAtActionSchema>;

export const ActionSchema = t.union([SmileActionSchema, LookAtActionSchema]);

export type Action = t.TypeOf<typeof ActionSchema>;
