import { ScriptEventEmitters } from "../model/script-event";

export abstract class GameScript {
  abstract register(eventEmitters: ScriptEventEmitters): void;
}
