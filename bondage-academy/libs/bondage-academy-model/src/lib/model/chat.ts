import { TranslatableText } from "../i18n/translatable-text";

export interface ChatMessage {
  time: number;
  action?: boolean;
  speaker?: TranslatableText;
  content?: TranslatableText;
}
