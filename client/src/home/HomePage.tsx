import LoginForm from "../account/LoginForm";
import { navigationService } from "../common/NavigationService";
import { View } from "../common/model/View";

export default function HomePage() {
  function registerAccount() {
    navigationService.navigate(View.RegisterAccount);
  }

  return (
    <div>
      <LoginForm />
      <button onClick={registerAccount}>Create account</button>
    </div>
  );
}
