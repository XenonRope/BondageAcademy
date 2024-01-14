import { Actor, Character } from "@bondage-academy/bondage-academy-model";

export interface ActorData {
  actor: Actor;
  character: Character;
  roomId?: number;
  playerId?: number;
}
