import { ItemCode, itemConfigs } from "@bondage-academy/bondage-academy-model";

export class ItemPreviewService {
  getPreviewImageUrl(itemCode: ItemCode): string | undefined {
    if (!itemConfigs[itemCode].preview) {
      return undefined;
    }

    return `item/${itemConfigs[itemCode].preview}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
