export enum ActorType {
  Player = "Player",
}

export interface Actor {
  type: ActorType;
}

export interface PlayerActor extends Actor {
  type: ActorType.Player;
  playerId: number;
}

export const isPlayerActor = (actor?: Actor): actor is PlayerActor =>
  actor != null && actor.type === ActorType.Player;
