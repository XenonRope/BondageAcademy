import {
  ChatMessage,
  ChatMessageEvent,
  EventFromServer,
} from "@bondage-academy/bondage-academy-model";
import { Session } from "../session/model/session";

export class ChatService {
  sendChatMessage(
    sessions: Session[],
    message: Omit<ChatMessage, "time">
  ): void {
    const event: ChatMessageEvent = {
      message: {
        ...message,
        time: new Date().getTime(),
      },
    };
    sessions.forEach((session) => {
      session.socket.emit(EventFromServer.ChatMessage, event);
    });
  }
}
