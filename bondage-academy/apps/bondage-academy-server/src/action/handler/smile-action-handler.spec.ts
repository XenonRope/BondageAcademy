import { Action, ActionType } from "@bondage-academy/bondage-academy-model";
import { configureMockServiceContainer } from "../../test/mock-container";
import { SmileActionHandler } from "./smile-action-handler";

let smileActionHandler: SmileActionHandler;

beforeEach(() => {
  const container = configureMockServiceContainer();
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
