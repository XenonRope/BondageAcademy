import { Item, itemConfigs } from "@bondage-academy/bondage-academy-model";

export class ItemPreviewService {
  getPreviewImageUrl(item: Item): string {
    return `item/${itemConfigs[item.code].preview}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
