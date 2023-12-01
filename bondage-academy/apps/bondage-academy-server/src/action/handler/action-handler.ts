import { Action, Actor } from "@bondage-academy/bondage-academy-model";

export interface ActionHandler<T extends Action> {
  canHandle(action: Action): action is T;

  handle(actor: Actor, action: T): Promise<void>;
}
