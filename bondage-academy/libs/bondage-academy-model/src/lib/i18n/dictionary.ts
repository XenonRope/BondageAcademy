import * as i18n from "@solid-primitives/i18n";
import { enDictionary } from "./en";

export type RawDictionary = typeof enDictionary;

export type Dictionary = i18n.Flatten<RawDictionary>;

export type DictionaryKey = keyof Dictionary;
