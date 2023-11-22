import { PlayerJoinRoomEvent, ScriptEventEmitters } from "./model/script-event";
import { GameScript } from "./scripts/game-script";

export class ScriptService {
  private eventEmitters: ScriptEventEmitters = {
    onPlayerJoinRoom: [],
  };

  addScripts(scripts: GameScript[]) {
    scripts.forEach((script) => script.register(this.eventEmitters));
  }

  async onPlayerJoinRoom(event: PlayerJoinRoomEvent): Promise<void> {
    await Promise.all(
      this.eventEmitters.onPlayerJoinRoom.map((handler) => handler(event))
    );
  }
}
