import { createSignal } from "solid-js";
import { accountService, navigationService, t } from "../app/services";
import { View } from "../common/model/view";
import LocaleSelector from "../locale/locale-selector";
import Button from "../ui/button";
import Label from "../ui/label";
import TextInput from "../ui/text-input";

export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  function login() {
    accountService
      .login({
        username: username(),
        password: password(),
      })
      .then(() => {
        navigationService.navigate(View.Game);
      })
      .catch(console.log);
  }

  function registerAccount() {
    navigationService.navigate(View.RegisterAccount);
  }

  return (
    <div class="max-w-sm mx-auto">
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
      <div class="flex mb-4">
        <div class="mr-4">
          <Button onClick={login}>{t("common.login")}</Button>
        </div>
        <div>
          <Button onClick={registerAccount}>{t("common.createAccount")}</Button>
        </div>
      </div>
      <div>
        <LocaleSelector />
      </div>
    </div>
  );
}
