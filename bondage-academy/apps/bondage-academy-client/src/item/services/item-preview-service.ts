import {
  Item,
  ItemCode,
  PartialRecord,
} from "@bondage-academy/bondage-academy-model";

const IMAGE_BY_ITEM_CODE: PartialRecord<ItemCode, string> = {
  [ItemCode.BallGag]: "Ball Gag",
  [ItemCode.XFashionSleeve]: "X Fashion Sleeve",
  [ItemCode.PetSuit]: "Pet Suit",
  [ItemCode.XFashionThong]: "X Fashion Thong",
};

export class ItemPreviewService {
  getPreviewImageUrl(item: Item) {
    return `item/${IMAGE_BY_ITEM_CODE[item.code]}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
