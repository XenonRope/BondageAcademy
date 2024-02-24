import {
  MinigameProgessRequest,
  RequestFromClient,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { SocketService } from "../../common/socket-service";

@singleton()
export class MinigameService {
  constructor(@inject(SocketService) private socketService: SocketService) {}

  async changeProgess(
    minigameId: number,
    progressChange: number,
  ): Promise<void> {
    const request: MinigameProgessRequest = {
      minigameId,
      progressChange,
    };
    await this.socketService.emit(RequestFromClient.ChangeProgess, request);
  }
}
