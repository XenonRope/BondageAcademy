import {
  Dictionary,
  RawDictionary,
} from "@bondage-academy/bondage-academy-model";
import type { NullableTranslator } from "@solid-primitives/i18n";
import * as i18n from "@solid-primitives/i18n";
import { createResource } from "solid-js";
import type { Locale, Store } from "../../store/model/store";

export class LocaleService {
  constructor(private store: Store) {}

  createTranslator(): NullableTranslator<Dictionary> {
    const [dictionary] = createResource(
      () => this.store.locale,
      async (locale) => await this.fetchDictionary(locale)
    );
    return i18n.translator(dictionary, i18n.resolveTemplate);
  }

  async fetchDictionary(locale: Locale): Promise<Dictionary> {
    const dictionary: RawDictionary = (await import(`../../i18n/${locale}.ts`))
      .dictionary;
    return i18n.flatten(dictionary);
  }
}
