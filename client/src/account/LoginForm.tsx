import { createSignal } from "solid-js";
import { navigationService } from "../common/NavigationService";
import { View } from "../common/model/View";
import LocaleSelector from "../locale/LocaleSelector";
import { t } from "../locale/services/LocaleService";
import Button from "../ui/Button";
import Label from "../ui/Label";
import TextInput from "../ui/TextInput";
import { accountService } from "./service/AccountService";

export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  async function login() {
    await accountService.login({
      username: username(),
      password: password(),
    });
    navigationService.navigate(View.Game);
  }

  function registerAccount() {
    navigationService.navigate(View.RegisterAccount);
  }

  return (
    <div class="max-w-sm mx-auto">
      <div class="mb-4">
        <Label for="username">{t("common.username")}</Label>
        <TextInput id="username" value={username()} onInput={setUsername} />
      </div>
      <div class="mb-4">
        <Label for="password">{t("common.password")}</Label>
        <TextInput id="password" value={password()} onInput={setPassword} />
      </div>
      <div class="mb-4">
        <Button onClick={login}>{t("common.login")}</Button>
      </div>
      <div class="mb-4">
        <Button onClick={registerAccount}>{t("common.createAccount")}</Button>
      </div>
      <div>
        <LocaleSelector />
      </div>
    </div>
  );
}
