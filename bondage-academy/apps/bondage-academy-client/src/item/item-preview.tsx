import { Item } from "@bondage-academy/bondage-academy-model";
import { itemPreviewService } from "./services/item-preview-service";

export default function ItemPreview(props: {
  item?: Item;
  onClick?: () => void;
}) {
  return (
    <div
      class="h-[48px] w-[48px] border-[3px] bg-contain border-primary-800 bg-primary-100"
      classList={{ "hover:bg-primary-200": props.onClick != null }}
      style={
        props.item
          ? {
              "background-image": `url("${itemPreviewService.getPreviewImageUrl(
                props.item
              )}")`,
            }
          : undefined
      }
      onClick={props.onClick}
    />
  );
}
