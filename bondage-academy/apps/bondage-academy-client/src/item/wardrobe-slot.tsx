import {
  Item,
  Slot,
  slotConfigs,
} from "@bondage-academy/bondage-academy-model";
import { t } from "../app/services";
import ItemPreview from "./item-preview";

export default function WardrobeSlot(props: {
  slot: Slot;
  item?: Item;
  onItemChange?: () => void;
}) {
  function getSlotName(): string {
    return t(slotConfigs[props.slot].name) as string;
  }

  return (
    <div class="flex">
      <ItemPreview item={props.item} onClick={props.onItemChange} />
      <div class="ml-2 font-semibold">
        <div>{getSlotName()}</div>
      </div>
    </div>
  );
}
