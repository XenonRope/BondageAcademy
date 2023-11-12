import * as i18n from "@solid-primitives/i18n";
import { createResource } from "solid-js";
import type { RawDictionary } from "../../i18n/en";
import { store, type Locale } from "../../store/StoreService";

export type Dictionary = i18n.Flatten<RawDictionary>;

export class LocaleService {
  async fetchDictionary(locale: Locale): Promise<Dictionary> {
    const dictionary: RawDictionary = (await import(`/src/i18n/${locale}.ts`))
      .dictionary;
    return i18n.flatten(dictionary);
  }
}

export const localeService = new LocaleService();

const [dictionary] = createResource(
  () => store.locale,
  async (locale) => await localeService.fetchDictionary(locale),
);

export const t = i18n.translator(dictionary);
