import { store, storeService } from "../app/services";
import type { Locale } from "../store/model/store";
import { enIcon, plIcon } from "../ui/icons";

export default function LocaleSelector() {
  const locales: Locale[] = ["en", "pl"];

  function changeLocale() {
    const nextLocale =
      locales[(locales.indexOf(store.locale) + 1) % locales.length];
    storeService.setLocale(nextLocale);
  }

  function getIcon() {
    switch (store.locale) {
      case "en":
        return enIcon;
      case "pl":
        return plIcon;
    }
  }

  return (
    <div onClick={changeLocale} class="h-[96px] w-[72px]">
      {getIcon()}
    </div>
  );
}
