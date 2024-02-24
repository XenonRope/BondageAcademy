import {
  RequestFromClient,
  SpeakRequest,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { SocketService } from "../../common/socket-service";

@singleton()
export class ChatService {
  constructor(@inject(SocketService) private socketService: SocketService) {}

  async speak(content: string): Promise<void> {
    const request: SpeakRequest = {
      content,
    };
    await this.socketService.emit(RequestFromClient.Speak, request);
  }
}
