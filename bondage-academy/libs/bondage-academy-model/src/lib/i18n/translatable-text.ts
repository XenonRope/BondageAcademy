import { PartialRecord } from "../model/partial-record";
import { DictionaryKey } from "./dictionary";

export type TranslatableText =
  | string
  | {
      dictionaryKey: DictionaryKey;
      params?: PartialRecord<string, TranslatableText>;
    };
