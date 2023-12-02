import {
  Action,
  ActionRequest,
  RequestFromClient,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";

export class ActionService {
  constructor(private socketService: SocketService) {}

  async executeAction(action: Action): Promise<void> {
    const request: ActionRequest = {
      action,
    };
    await this.socketService.emit(RequestFromClient.Action, request);
  }
}
