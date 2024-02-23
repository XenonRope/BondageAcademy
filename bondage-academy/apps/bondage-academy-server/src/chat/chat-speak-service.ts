import { Player } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";
import { ChatService } from "./chat-service";

@singleton()
export class ChatSpeakService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(SessionService)
    private sessionService: SessionService,
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(ChatService)
    private chatService: ChatService,
  ) {}

  async speak(playerId: number, content: string): Promise<void> {
    if (content === "") {
      throw new Error("Speak content cannot be empty");
    }
    const player = await this.playerStoreService.get(playerId);
    const sessions = await this.getSessions(player);
    this.chatService.sendChatMessage(sessions, {
      speaker: player.name,
      content,
    });
  }

  private async getSessions(player: Player): Promise<Session[]> {
    if (!player.roomId) {
      const session = this.sessionService.getSessionByPlayerId(player.id);
      return session ? [session] : [];
    }
    return await this.roomSessionService.getSessionsInRoom(player.roomId);
  }
}
