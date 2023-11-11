import { type WearableCode } from "../../character/model/Wearable";

export enum ItemCode {
  XFashionSleeve = "XFashionSleeve",
  XFashionThong = "XFashionThong",
  BallGag = "BallGag",
  PetSuit = "PetSuit",
}

export enum ItemType {
  Wearable = "Wearable",
}

export interface Item {
  type: ItemType;
  code: ItemCode;
}

export interface WearableItem extends Item {
  type: ItemType.Wearable;
  wearableCode: WearableCode;
  
}
