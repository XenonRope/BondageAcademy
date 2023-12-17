import { Item, itemConfigs } from "@bondage-academy/bondage-academy-model";

export class ItemPreviewService {
  getPreviewImageUrl(item: Item): string | undefined {
    if (!itemConfigs[item.code].preview) {
      return undefined;
    }

    return `item/${itemConfigs[item.code].preview}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
