export enum ItemCode {
  XFashionSleeve = "XFashionSleeve",
  XFashionThong = "XFashionThong",
  BallGag = "BallGag",
  PetSuit = "PetSuit",
}
export interface Item {
  id: number;
  code: ItemCode;
}
