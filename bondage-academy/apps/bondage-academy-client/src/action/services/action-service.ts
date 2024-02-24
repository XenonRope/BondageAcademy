import {
  Action,
  ActionRequest,
  RequestFromClient,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { SocketService } from "../../common/socket-service";

@singleton()
export class ActionService {
  constructor(@inject(SocketService) private socketService: SocketService) {}

  async executeAction(action: Action): Promise<void> {
    const request: ActionRequest = {
      action,
    };
    await this.socketService.emit(RequestFromClient.Action, request);
  }
}
