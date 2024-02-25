import { DictionaryKey } from "../i18n/dictionary";
import { NPCCode } from "./npc-object";

export interface DialogueOptionContext {
  roomId: number;
}

export interface DialogueOption {
  condition: (context: DialogueOptionContext) => boolean;
  npcCode: NPCCode;
  content: DictionaryKey;
}
