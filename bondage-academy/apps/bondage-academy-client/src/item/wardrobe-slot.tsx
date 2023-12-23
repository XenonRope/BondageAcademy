import {
  ItemCode,
  Slot,
  itemConfigs,
  slotConfigs,
} from "@bondage-academy/bondage-academy-model";
import { t } from "../app/services";
import ItemPreview from "./item-preview";

export default function WardrobeSlot(props: {
  slot: Slot;
  itemCode?: ItemCode;
  onItemChange?: () => void;
}) {
  function getSlotName(): string {
    return t(slotConfigs[props.slot].name);
  }

  function getItemName(): string {
    return props.itemCode ? t(itemConfigs[props.itemCode].name) : "";
  }

  return (
    <div class="flex">
      <ItemPreview itemCode={props.itemCode} onClick={props.onItemChange} />
      <div class="ml-2">
        <div class="font-bold">{getSlotName()}</div>
        <div class="font-semibold">{getItemName()}</div>
      </div>
    </div>
  );
}
