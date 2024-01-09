import { Character } from "./character";
import { GameObject, ObjectType } from "./game-object";

export enum NPCCode {
  Headmistress = "Headmistress",
  PrisonGuard = "PrisonGuard",
}

export interface NPCObject extends GameObject {
  type: ObjectType.NPC;
  code: NPCCode;
  character: Character;
}

export const isNPCObject = (object?: GameObject): object is NPCObject =>
  object != null && object.type === ObjectType.NPC;
