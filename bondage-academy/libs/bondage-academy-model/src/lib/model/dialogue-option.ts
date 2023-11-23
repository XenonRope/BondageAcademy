import { DictionaryKey } from "../i18n/dictionary";
import { NPCCode } from "./npc-object";
import { Room } from "./room";

export interface DialogueOptionContext {
  room: Room;
}

export interface DialogueOption {
  condition: (context: DialogueOptionContext) => boolean;
  npcCode: NPCCode;
  content: DictionaryKey;
}
