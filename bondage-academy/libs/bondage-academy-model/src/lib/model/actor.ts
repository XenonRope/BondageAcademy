import * as t from "io-ts";

export enum ActorType {
  Player = "Player",
  NPC = "NPC",
}

export const PlayerActor = t.type({
  type: t.literal(ActorType.Player),
  playerId: t.number,
});

export type PlayerActor = t.TypeOf<typeof PlayerActor>;

export const NPCActor = t.type({
  type: t.literal(ActorType.NPC),
  objectId: t.number,
  roomId: t.number,
});

export type NPCActor = t.TypeOf<typeof NPCActor>;

export const Actor = t.union([PlayerActor, NPCActor]);

export type Actor = t.TypeOf<typeof Actor>;

export const isPlayerActor = (actor?: Actor): actor is PlayerActor =>
  actor != null && actor.type === ActorType.Player;

export const isNPCActor = (actor?: Actor): actor is NPCActor =>
  actor != null && actor.type === ActorType.NPC;

export const areActorsEqual = (
  firstActor?: Actor,
  secondActor?: Actor
): boolean => {
  if (firstActor == null && secondActor == null) {
    return true;
  }
  if (firstActor == null || secondActor == null) {
    return false;
  }
  if (isPlayerActor(firstActor) && isPlayerActor(secondActor)) {
    return firstActor.playerId === secondActor.playerId;
  }
  if (isNPCActor(firstActor) && isNPCActor(secondActor)) {
    return (
      firstActor.objectId === secondActor.objectId &&
      firstActor.roomId === secondActor.roomId
    );
  }
  return false;
};

export const prepareActorByPlayerId = (playerId: number): PlayerActor => ({
  type: ActorType.Player,
  playerId,
});
