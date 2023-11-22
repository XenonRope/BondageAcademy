import { DictionaryKey } from "../i18n/dictionary";

export interface ChatMessage {
  time: number;
  speaker?: string;
  speakerDictionaryKey?: DictionaryKey;
  content?: string;
  contentDictionaryKey?: DictionaryKey;
}
