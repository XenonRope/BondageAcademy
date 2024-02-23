import { Action, Actor } from "@bondage-academy/bondage-academy-model";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { ActionHandler } from "./handler/action-handler";
import { SmileActionHandler } from "./handler/smile-action-handler";

@registry([
  {
    token: "actionHandlers",
    useFactory: instanceCachingFactory((container) => [
      container.resolve(SmileActionHandler),
    ]),
  },
])
@singleton()
export class ActionExecutorService {
  constructor(
    @inject("actionHandlers") private actionHandlers: ActionHandler<Action>[],
  ) {}

  async executeAction(actor: Actor, action: Action): Promise<void> {
    for (const handler of this.actionHandlers) {
      if (handler.canHandle(action)) {
        await handler.handle(actor, action);
        return;
      }
    }
    throw new Error("No handler for action " + action.type);
  }
}
