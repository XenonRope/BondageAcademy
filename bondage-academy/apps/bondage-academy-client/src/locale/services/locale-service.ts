import {
  Dictionary,
  DictionaryKey,
  RawDictionary,
  TranslatableText,
} from "@bondage-academy/bondage-academy-model";
import * as i18n from "@solid-primitives/i18n";
import { createResource } from "solid-js";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { token } from "../../app/token";
import type { Locale, Store } from "../../store/model/store";
import { STORE } from "../../store/store-service";
import { SimpleTranslator, Translator } from "../model/translator";

export const TRANSLATOR = token<Translator>("translator");
export const SIMPLE_TRANSLATOR = token<SimpleTranslator>("simpleTranslator");

@registry([
  {
    token: TRANSLATOR,
    useFactory: instanceCachingFactory((container) =>
      container.resolve(LocaleService).createTranslator(),
    ),
  },
  {
    token: SIMPLE_TRANSLATOR,
    useFactory: instanceCachingFactory((container): SimpleTranslator => {
      const translator = container.resolve(TRANSLATOR);
      return (dictionaryKey: DictionaryKey) => translator({ dictionaryKey });
    }),
  },
])
@singleton()
export class LocaleService {
  constructor(@inject(STORE) private store: Store) {}

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
