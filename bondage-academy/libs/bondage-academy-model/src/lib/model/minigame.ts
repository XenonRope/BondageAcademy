import { Actor } from "./actor";
import { Item, PhantomItem } from "./item";
import { Slot } from "./slot";

export enum MinigameChallangeType {
  Click = "Click",
}

export interface MinigameChallange {
  type: MinigameChallangeType;
}

export interface ClickMinigameChallange {
  type: MinigameChallangeType.Click;
}

export const isClickMinigameChallange = (
  challange: MinigameChallange,
): challange is ClickMinigameChallange =>
  challange.type === MinigameChallangeType.Click;

export enum MinigameStakeType {
  ChangeWardrobe = "ChangeWardrobe",
}

export interface MinigameStake {
  type: MinigameStakeType;
}

export interface ChangeWardrobeMinigameStake extends MinigameStake {
  type: MinigameStakeType.ChangeWardrobe;
  slot: Slot;
  item?: Item | PhantomItem;
  currentItem?: Item | PhantomItem;
}

export const isChangeWardrobeMinigameStake = (
  stake: MinigameStake,
): stake is ChangeWardrobeMinigameStake =>
  stake.type === MinigameStakeType.ChangeWardrobe;

export interface Minigame {
  id: number;
  roomId?: number;
  actor: Actor;
  target?: Actor;
  challange: MinigameChallange;
  stake: MinigameStake;
}
