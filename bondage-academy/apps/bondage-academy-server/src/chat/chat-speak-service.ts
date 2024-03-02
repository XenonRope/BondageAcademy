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

    const sessions = await this.getSessions(playerId);
    const playerName = await this.playerStoreService.getPlayerName(playerId);
    this.chatService.sendChatMessage(sessions, {
      speaker: playerName,
      content,
    });
  }

  private async getSessions(playerId: number): Promise<Session[]> {
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      return session ? [session] : [];
    }
    return await this.roomSessionService.getSessionsByRoomId(roomId);
  }
}
