import {
  MinigameProgessRequest,
  RequestFromClient,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";

export class MinigameService {
  constructor(private socketService: SocketService) {}

  async changeProgess(
    minigameId: number,
    progressChange: number
  ): Promise<void> {
    const request: MinigameProgessRequest = {
      minigameId,
      progressChange,
    };
    await this.socketService.emit(RequestFromClient.ChangeProgess, request);
  }
}
