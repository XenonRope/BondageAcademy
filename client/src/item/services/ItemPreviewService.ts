import { ItemCode, type Item } from "../model/Item";

const IMAGE_BY_ITEM_CODE: Record<ItemCode, string> = {
  [ItemCode.XFashionSleeve]: "X Fashion Sleeve",
};

export class ItemPreviewService {
  getPreviewImageUrl(item: Item) {
    return `public/item/${IMAGE_BY_ITEM_CODE[item.code]}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
