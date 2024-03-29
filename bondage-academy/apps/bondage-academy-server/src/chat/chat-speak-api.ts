import { SpeakRequestSchema } from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { ChatSpeakService } from "./chat-speak-service";

@singleton()
export class ChatSpeakApi {
  constructor(
    @inject(ChatSpeakService)
    private chatSpeakService: ChatSpeakService,
    @inject(MinigameService)
    private minigameService: MinigameService,
  ) {}

  async speak(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);

    const speakRequest = await tPromise.decode(SpeakRequestSchema, request);
    await this.chatSpeakService.speak(session.playerId, speakRequest.content);
  }
}
