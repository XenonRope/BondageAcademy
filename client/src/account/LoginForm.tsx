import { createSignal } from "solid-js";
import { setStore } from "../common/Store";
import { View } from "../common/model/View";
import { accountService } from "./services/AccountService";

export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  async function login() {
    const player = await accountService.login({
      username: username(),
      password: password(),
    });
    setStore({ view: View.Game, player });
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
      <button onClick={login}>Login</button>
    </div>
  );
}
