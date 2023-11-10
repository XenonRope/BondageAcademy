import { createSignal } from "solid-js";
import { navigationService } from "../common/NavigationService";
import { View } from "../common/model/View";
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

  return (
    <div>
      <div>
        <label>Username</label>
        <input
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <div>
        <label>Nick</label>
        <input value={nick()} onInput={(e) => setNick(e.currentTarget.value)} />
      </div>
      <button onClick={registerAccount}>Create account</button>
    </div>
  );
}
