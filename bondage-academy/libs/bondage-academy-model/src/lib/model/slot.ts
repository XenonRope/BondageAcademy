import { DictionaryKey } from "../i18n/dictionary";

export enum Slot {
  LeftSleeve = "LeftSleeve",
  RightSleeve = "RightSleeve",
  Mouth = "Mouth",
  Body = "Body",
}

export interface SlotConfig {
  name: DictionaryKey;
}

export const slotConfigs: Record<Slot, SlotConfig> = {
  [Slot.LeftSleeve]: {
    name: "slots.leftSleeve",
  },
  [Slot.RightSleeve]: {
    name: "slots.rightSleeve",
  },
  [Slot.Mouth]: {
    name: "slots.mouth",
  },
  [Slot.Body]: {
    name: "slots.body",
  },
};
