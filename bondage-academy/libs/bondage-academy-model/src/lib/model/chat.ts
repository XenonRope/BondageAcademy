import { BaseTemplateArgs } from "@solid-primitives/i18n";
import { DictionaryKey } from "../i18n/dictionary";

export interface ChatMessage {
  time: number;
  action?: boolean;
  speaker?: string;
  speakerDictionaryKey?: DictionaryKey;
  content?: string;
  contentDictionaryKey?: DictionaryKey;
  contentParams?: BaseTemplateArgs;
}
