import {
  Dictionary,
  RawDictionary,
  TranslatableText,
} from "@bondage-academy/bondage-academy-model";
import * as i18n from "@solid-primitives/i18n";
import { createResource } from "solid-js";
import type { Locale, Store } from "../../store/model/store";
import { Translator } from "../model/translator";

export class LocaleService {
  constructor(private store: Store) {}

  createTranslator(): Translator {
    const internalTranslator = this.createInternalTranslator();
    return (translatableText: TranslatableText) => {
      return this.translate(translatableText, internalTranslator);
    };
  }

  private createInternalTranslator(): i18n.NullableTranslator<Dictionary> {
    const [dictionary] = createResource(
      () => this.store.locale,
      async (locale) => await this.fetchDictionary(locale),
    );
    return i18n.translator(dictionary);
  }

  private translate(
    translatableText: TranslatableText,
    internalTranslator: i18n.NullableTranslator<Dictionary>,
  ): string {
    if (typeof translatableText === "string") {
      return translatableText;
    }
    const templateArgs: i18n.BaseTemplateArgs = {};
    for (const key in translatableText.params) {
      const param = translatableText.params[key];
      if (param) {
        templateArgs[key] = this.translate(param, internalTranslator);
      }
    }
    return internalTranslator(
      translatableText.dictionaryKey,
      templateArgs,
    ) as string;
  }

  async fetchDictionary(locale: Locale): Promise<Dictionary> {
    const dictionary: RawDictionary = (await import(`../../i18n/${locale}.ts`))
      .dictionary;
    return i18n.flatten(dictionary);
  }
}
