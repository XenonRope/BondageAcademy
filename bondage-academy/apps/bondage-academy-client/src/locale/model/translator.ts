import {
  DictionaryKey,
  TranslatableText,
} from "@bondage-academy/bondage-academy-model";

export type Translator = (translatableText: TranslatableText) => string;

export type SimpleTranslator = (dictionaryKey: DictionaryKey) => string;
