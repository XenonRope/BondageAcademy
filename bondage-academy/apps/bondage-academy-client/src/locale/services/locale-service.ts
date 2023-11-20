import type { NullableTranslator } from "@solid-primitives/i18n";
import * as i18n from "@solid-primitives/i18n";
import { createResource } from "solid-js";
import type { RawDictionary } from "../../i18n/en";
import type { Locale, Store } from "../../store/model/store";

export type Dictionary = i18n.Flatten<RawDictionary>;

export type DictionaryKey = keyof Dictionary;

export class LocaleService {
  constructor(private store: Store) {}

  createTranslator(): NullableTranslator<Dictionary> {
    const [dictionary] = createResource(
      () => this.store.locale,
      async (locale) => await this.fetchDictionary(locale)
    );
    return i18n.translator(dictionary);
  }

  async fetchDictionary(locale: Locale): Promise<Dictionary> {
    const dictionary: RawDictionary = (await import(`../../i18n/${locale}.ts`))
      .dictionary;
    return i18n.flatten(dictionary);
  }
}
