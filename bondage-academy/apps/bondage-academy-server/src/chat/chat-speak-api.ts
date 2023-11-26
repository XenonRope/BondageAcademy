import { SpeakRequestSchema } from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { ChatSpeakService } from "./chat-speak-service";

export class ChatSpeakApi {
  constructor(
    private chatSpeakService: ChatSpeakService,
    private minigameService: MinigameService
  ) {}

  async speak(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    if (this.minigameService.getMinigameByPlayerId(session.playerId)) {
      throw new Error("User is during minigame");
    }

    const speakRequest = await tPromise.decode(SpeakRequestSchema, request);
    await this.chatSpeakService.speak(session.playerId, speakRequest.content);
  }
}
