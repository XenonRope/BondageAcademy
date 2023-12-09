import { Item, itemConfigs } from "@bondage-academy/bondage-academy-model";

export class ItemPreviewService {
  getPreviewImageUrl(item: Item): string {
    const variant = item.variant ? ` ${item.variant}` : "";
    return `item/${itemConfigs[item.code].preview}${variant}.png`;
  }
}

export const itemPreviewService = new ItemPreviewService();
