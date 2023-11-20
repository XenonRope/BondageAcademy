import { GameObject, ObjectType } from "./game-object";

export enum NPCCode {
  Tutor = "Tutor",
}

export interface NPCObject extends GameObject {
  type: ObjectType.NPC;
  code: NPCCode;
}

export const isNPCObject = (object?: GameObject): object is NPCObject =>
  object != null && object.type === ObjectType.NPC;
