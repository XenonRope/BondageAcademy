import { Item } from "@bondage-academy/bondage-academy-model";
import { createMemo } from "solid-js";
import { itemPreviewService } from "./services/item-preview-service";

export default function ItemPreview(props: {
  item?: Item;
  onClick?: () => void;
}) {
  const previewIamgeUrlStyle = createMemo(() => {
    if (!props.item) {
      return undefined;
    }
    const url = itemPreviewService.getPreviewImageUrl(props.item);
    if (!url) {
      return undefined;
    }
    return `url("${url}")`;
  });

  return (
    <div
      class="h-[48px] w-[48px] border-[3px] bg-contain border-primary-800 bg-primary-100"
      classList={{ "hover:bg-primary-200": props.onClick != null }}
      style={{
        "background-image": previewIamgeUrlStyle(),
      }}
      onClick={props.onClick}
    />
  );
}
