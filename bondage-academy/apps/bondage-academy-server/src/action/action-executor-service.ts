import { Action, Actor } from "@bondage-academy/bondage-academy-model";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { token } from "../app/token";
import { ActionHandler } from "./handler/action-handler";
import { SmileActionHandler } from "./handler/smile-action-handler";

const ACTION_HANDLERS = token<ActionHandler<Action>[]>("actionHandlers");

@registry([
  {
    token: ACTION_HANDLERS,
    useFactory: instanceCachingFactory((container) => [
      container.resolve(SmileActionHandler),
    ]),
  },
])
@singleton()
export class ActionExecutorService {
  constructor(
    @inject(ACTION_HANDLERS) private actionHandlers: ActionHandler<Action>[],
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
