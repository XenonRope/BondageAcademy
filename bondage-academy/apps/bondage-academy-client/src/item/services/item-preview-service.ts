import { Item, ItemCode } from "@bondage-academy/bondage-academy-model";

const IMAGE_BY_ITEM_CODE: Record<ItemCode, string> = {
  [ItemCode.XFashionSleeve]: "X Fashion Sleeve",
  [ItemCode.XFashionThong]: "X Fashion Thong",
  [ItemCode.BallGag]: "Ball Gag",
  [ItemCode.PetSuit]: "Pet Suit",
};

export class ItemPreviewService {
  getPreviewImageUrl(item: Item) {
    return `item/${IMAGE_BY_ITEM_CODE[item.code]}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
