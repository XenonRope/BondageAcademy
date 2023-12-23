import * as t from "io-ts";
import { TypeUtils } from "../utils/type-utils";

export enum ItemCode {
  // Hair
  HalleyHair1 = "HalleyHair1",

  // Mouth
  BallGag = "BallGag",

  // Nipples
  NipplePiercingSphere = "NipplePiercingSphere",
  NipplePiercingSpider = "NipplePiercingSpider",
  NipplePiercingCShape = "NipplePiercingCShape",
  NipplePiercingOrnament = "NipplePiercingOrnament",
  NipplePiercingMoon = "NipplePiercingMoon",

  // Upper undies
  BeccaMeshBra = "BeccaMeshBra",
  BeyondSuitBra = "BeyondSuitBra",

  // Upper outfit
  BeccaMeshTop = "BeccaMeshTop",

  // Sleeve
  XFashionSleeve = "XFashionSleeve",
  MagicChristmasGlove = "MagicChristmasGlove",

  // Body
  PetSuit = "PetSuit",

  // Lower undies
  XFashionThong = "XFashionThong",

  // Shoes
  CynthiaHighHeels = "CynthiaHighHeels",
}

export interface Item {
  id: number;
  code: ItemCode;
}

export const PhantomItem = t.type({
  code: TypeUtils.fromEnum(ItemCode),
});

export type PhantomItem = t.TypeOf<typeof PhantomItem>;

export const ItemReference = t.type({
  id: t.number,
});

export type ItemReference = t.TypeOf<typeof ItemReference>;

export const isItem = (item?: Item | PhantomItem): item is Item => {
  return item ? (item as Item).id !== undefined : false;
};

export const isPhantomItem = (
  item?: Item | PhantomItem | ItemReference
): item is PhantomItem => {
  return item ? (item as Item).id === undefined : false;
};

export const isItemReference = (
  item?: PhantomItem | ItemReference
): item is ItemReference => {
  return item ? (item as ItemReference).id !== undefined : false;
};
