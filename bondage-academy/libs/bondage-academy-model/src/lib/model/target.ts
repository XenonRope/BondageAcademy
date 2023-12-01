import * as t from "io-ts";

export enum TargetType {
  Player = "Player",
  NPC = "NPC",
}

export const PlayerTargetSchema = t.type({
  type: t.literal(TargetType.Player),
  playerId: t.number,
});

export type PlayerTarget = t.TypeOf<typeof PlayerTargetSchema>;

export const NPCTargetSchema = t.type({
  type: t.literal(TargetType.NPC),
  objectId: t.number,
});

export type NPCTarget = t.TypeOf<typeof NPCTargetSchema>;

export const TargetSchema = t.union([PlayerTargetSchema, NPCTargetSchema]);

export type Target = t.TypeOf<typeof TargetSchema>;
