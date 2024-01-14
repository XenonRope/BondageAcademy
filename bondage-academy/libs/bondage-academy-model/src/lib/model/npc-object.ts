import { Character } from "./character";
import { GameObject, ObjectType } from "./game-object";
import { Item } from "./item";

export enum NPCCode {
  Headmistress = "Headmistress",
  PrisonGuard = "PrisonGuard",
}

export interface NPCObject extends GameObject {
  type: ObjectType.NPC;
  code: NPCCode;
  character: Character;
  items: Item[];
}

export const isNPCObject = (object?: GameObject): object is NPCObject =>
  object != null && object.type === ObjectType.NPC;
