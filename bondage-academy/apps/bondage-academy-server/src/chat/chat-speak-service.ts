import {
  ChatMessageEvent,
  EventFromServer,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { SessionService } from "../session/session-service";

export class ChatSpeakService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private sessionService: SessionService,
    private roomSessionService: RoomSessionService
  ) {}

  async speak(playerId: number, content: string): Promise<void> {
    if (content === "") {
      throw new Error("Speak content cannot be empty");
    }
    const player = await this.playerStoreService.get(playerId);
    const event: ChatMessageEvent = {
      message: { time: new Date().getTime(), speaker: player.name, content },
    };
    if (!player.roomId) {
      this.sessionService
        .getSessionByPlayerId(playerId)
        ?.socket.emit(EventFromServer.ChatMessage, event);
      return;
    }
    const sessions = await this.roomSessionService.getSessionsInRoom(
      player.roomId
    );
    sessions.forEach((session) =>
      session.socket.emit(EventFromServer.ChatMessage, event)
    );
  }
}
