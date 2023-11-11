import { createSignal } from "solid-js";
import { navigationService } from "../common/NavigationService";
import { setStore } from "../common/Store";
import { View } from "../common/model/View";
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
    setStore({ view: View.Game });
  }

  function registerAccount() {
    navigationService.navigate(View.RegisterAccount);
  }

  return (
    <div class="max-w-sm mx-auto">
      <div class="mb-4">
        <Label for="username">Username</Label>
        <TextInput id="username" value={username()} onInput={setUsername} />
      </div>
      <div class="mb-4">
        <Label for="password">Password</Label>
        <TextInput id="password" value={password()} onInput={setPassword} />
      </div>
      <div class="mb-4">
        <Button onClick={login}>Login</Button>
      </div>
      <div>
        <Button onClick={registerAccount}>Create account</Button>
      </div>
    </div>
  );
}
