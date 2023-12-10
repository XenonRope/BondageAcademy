export enum ItemCode {
  // Hair
  HalleyHair1 = "HalleyHair1",

  // Mouth
  BallGag = "BallGag",

  // Upper undies
  BeccaMeshBra = "BeccaMeshBra",

  // Sleeve
  XFashionSleeve = "XFashionSleeve",

  // BOdy
  PetSuit = "PetSuit",

  // Lower undies
  XFashionThong = "XFashionThong",

  // Shoes
  CynthiaHighHeels = "CynthiaHighHeels",
}

export interface Item {
  id: number;
  code: ItemCode;
  variant?: string;
}
