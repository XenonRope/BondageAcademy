import * as t from "io-ts";
import { ActionSchema } from "../model/action";

export const ActionRequestSchema = t.type({
  action: ActionSchema,
});

export type ActionRequest = t.TypeOf<typeof ActionRequestSchema>;
