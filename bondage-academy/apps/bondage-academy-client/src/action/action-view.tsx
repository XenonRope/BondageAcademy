import { Action, ActionType } from "@bondage-academy/bondage-academy-model";
import { actionService, t } from "../app/services";
import Button from "../ui/button";

export default function ActionView() {
  function smile() {
    executeAction({ type: ActionType.Smile, target: undefined });
  }

  function executeAction(action: Action) {
    actionService.executeAction(action).catch(console.log);
  }

  return (
    <div>
      <Button onClick={smile}>{t("action.smile.smile")}</Button>
    </div>
  );
}
