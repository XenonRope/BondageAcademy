import {
  RequestFromClient,
  SpeakRequest,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";

export class ChatService {
  constructor(private socketService: SocketService) {}

  async speak(content: string): Promise<void> {
    const request: SpeakRequest = {
      content,
    };
    await this.socketService.emit(RequestFromClient.Speak, request);
  }
}
