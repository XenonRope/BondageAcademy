import {
  ChatMessage,
  ChatMessageEvent,
  EventFromServer,
} from "@bondage-academy/bondage-academy-model";
import { Session } from "../session/model/session";

export class ChatService {
  sendChatMessage(sessions: Session[], message: ChatMessage): void {
    const event: ChatMessageEvent = {
      message,
    };
    sessions.forEach((session) => {
      session.socket.emit(EventFromServer.ChatMessage, event);
    });
  }
}
