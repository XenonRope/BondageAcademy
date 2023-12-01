import { Action, Actor } from "@bondage-academy/bondage-academy-model";
import { ActionHandler } from "./handler/action-handler";

export class ActionService {
  constructor(private handlers: ActionHandler<Action>[]) {}

  async executeAction(actor: Actor, action: Action): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.canHandle(action)) {
        await handler.handle(actor, action);
        return;
      }
    }
    throw new Error("No handler for action " + action.type);
  }
}
