import { createSignal } from "solid-js";
import { navigationService } from "../common/NavigationService";
import { View } from "../common/model/View";
import Button from "../ui/Button";
import Label from "../ui/Label";
import TextInput from "../ui/TextInput";
import { accountService } from "./service/AccountService";

export default function AccountRegistrationPage() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [nick, setNick] = createSignal("");

  async function registerAccount() {
    await accountService.registerAccount({
      username: username(),
      password: password(),
      nick: nick(),
    });
    navigationService.navigate(View.Home);
  }

  function cancel() {
    navigationService.navigate(View.Home);
  }

  return (
    <div class="container mx-auto p-4">
      <div class=" max-w-sm mx-auto">
        <div class="mb-4">
          <Label for="username">Username</Label>
          <TextInput id="username" value={username()} onInput={setUsername} />
        </div>
        <div class="mb-4">
          <Label for="password">Password</Label>
          <TextInput id="password" value={password()} onInput={setPassword} />
        </div>
        <div class="mb-4">
          <Label for="character_name">Character name</Label>
          <TextInput id="character_name" value={nick()} onInput={setNick} />
        </div>
        <div>
          <span class="mr-4">
            <Button onClick={registerAccount}>Create account</Button>
          </span>
          <Button onClick={cancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
