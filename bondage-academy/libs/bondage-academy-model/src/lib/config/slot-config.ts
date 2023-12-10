import { DictionaryKey } from "../i18n/dictionary";
import { Slot } from "../model/slot";

export interface SlotConfig {
  name: DictionaryKey;
}

export const slotConfigs: Record<Slot, SlotConfig> = {
  [Slot.Hair]: {
    name: "slots.hair",
  },
  [Slot.Mouth]: {
    name: "slots.mouth",
  },
  [Slot.UpperUndies]: {
    name: "slots.upperUndies",
  },
  [Slot.LeftSleeve]: {
    name: "slots.leftSleeve",
  },
  [Slot.RightSleeve]: {
    name: "slots.rightSleeve",
  },
  [Slot.Body]: {
    name: "slots.body",
  },
  [Slot.LowerUndies]: {
    name: "slots.lowerUndies",
  },
  [Slot.Shoes]: {
    name: "slots.shoes",
  },
};
