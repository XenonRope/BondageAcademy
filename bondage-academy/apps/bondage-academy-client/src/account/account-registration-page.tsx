import { createSignal } from "solid-js";
import { accountService, navigationService, t } from "../app/services";
import { View } from "../common/model/view";
import Button from "../ui/button";
import Label from "../ui/label";
import TextInput from "../ui/text-input";

export default function AccountRegistrationPage() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [nick, setNick] = createSignal("");

  function registerAccount() {
    accountService
      .registerAccount({
        username: username(),
        password: password(),
        nick: nick(),
      })
      .then(() => {
        navigationService.navigate(View.Home);
      })
      .catch(console.log);
  }

  function cancel() {
    navigationService.navigate(View.Home);
  }

  return (
    <div class="container mx-auto p-4">
      <div class=" max-w-sm mx-auto">
        <div class="mb-4">
          <Label for="username">{t("common.username")}</Label>
          <TextInput
            id="username"
            autocomplete="username"
            value={username()}
            onInput={setUsername}
          />
        </div>
        <div class="mb-4">
          <Label for="password">{t("common.password")}</Label>
          <TextInput
            id="password"
            type="password"
            value={password()}
            onInput={setPassword}
          />
        </div>
        <div class="mb-4">
          <Label for="character_name">{t("common.characterName")}</Label>
          <TextInput id="character_name" value={nick()} onInput={setNick} />
        </div>
        <div class="flex gap-2">
          <Button onClick={registerAccount}>{t("common.createAccount")}</Button>
          <Button onClick={cancel}>{t("common.back")}</Button>
        </div>
      </div>
    </div>
  );
}
