import { DictionaryKey } from "../i18n/dictionary";
import { Slot } from "../model/slot";

export enum SlotType {
  Body = "Body",
  Item = "Item",
}

export interface SlotConfig {
  type: SlotType;
  name: DictionaryKey;
}

export const slotConfigs: Record<Slot, SlotConfig> = {
  [Slot.Hair]: {
    type: SlotType.Body,
    name: "slots.hair",
  },
  [Slot.Mouth]: {
    type: SlotType.Item,
    name: "slots.mouth",
  },
  [Slot.UpperUndies]: {
    type: SlotType.Item,
    name: "slots.upperUndies",
  },
  [Slot.LeftSleeve]: {
    type: SlotType.Item,
    name: "slots.leftSleeve",
  },
  [Slot.RightSleeve]: {
    type: SlotType.Item,
    name: "slots.rightSleeve",
  },
  [Slot.Body]: {
    type: SlotType.Item,
    name: "slots.body",
  },
  [Slot.LowerUndies]: {
    type: SlotType.Item,
    name: "slots.lowerUndies",
  },
  [Slot.Shoes]: {
    type: SlotType.Item,
    name: "slots.shoes",
  },
};
