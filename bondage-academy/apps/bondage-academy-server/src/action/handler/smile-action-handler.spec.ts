import {
  Action,
  ActionType,
  TargetType,
} from "@bondage-academy/bondage-academy-model";
import { SmileActionHandler } from "./smile-action-handler";
import { container } from "tsyringe";

let smileActionHandler: SmileActionHandler;

beforeEach(() => {
  container.clearInstances();

  smileActionHandler = container.resolve(SmileActionHandler);
});

describe("canHandle", () => {
  test("Return true if action is Smile", () => {
    const action: Action = {
      type: ActionType.Smile,
      target: undefined,
    };

    expect(smileActionHandler.canHandle(action)).toBe(true);
  });

  test("Return false if action is not Smile", () => {
    const action: Action = {
      type: ActionType.LookAt,
      target: { type: TargetType.Player, playerId: 1 },
    };

    expect(smileActionHandler.canHandle(action)).toBe(false);
  });
});
