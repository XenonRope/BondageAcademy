import { singleton } from "tsyringe";
import {
  DialogueOptionUseEvent,
  PlayerJoinRoomEvent,
  ScriptEventEmitters,
} from "./model/script-event";
import { GameScript } from "./scripts/game-script";

@singleton()
export class ScriptService {
  private eventEmitters: ScriptEventEmitters = {
    onPlayerJoinRoom: [],
    onDialogueOptionUse: [],
  };

  addScripts(scripts: GameScript[]) {
    scripts.forEach((script) => script.register(this.eventEmitters));
  }

  async onPlayerJoinRoom(event: PlayerJoinRoomEvent): Promise<void> {
    await Promise.all(
      this.eventEmitters.onPlayerJoinRoom.map((handler) => handler(event)),
    );
  }

  async onDialogueOptionUse(event: DialogueOptionUseEvent): Promise<void> {
    await Promise.all(
      this.eventEmitters.onDialogueOptionUse.map((handler) => handler(event)),
    );
  }
}
