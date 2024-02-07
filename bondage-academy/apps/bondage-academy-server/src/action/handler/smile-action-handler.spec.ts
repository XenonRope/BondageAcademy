import { Action, ActionType } from "@bondage-academy/bondage-academy-model";
import { configureServiceContainer } from "../../app/services";
import { SmileActionHandler } from "./smile-action-handler";

let smileActionHandler: SmileActionHandler;

beforeEach(() => {
  const container = configureServiceContainer();
  smileActionHandler = container.smileActionHandler;
});

describe("canHandle", () => {
  test("Return true if action is Smile", () => {
    const action: Action = {
      type: ActionType.Smile,
      target: undefined,
    };

    expect(smileActionHandler.canHandle(action)).toBe(true);
  });
});
