import {
  RequestFromClient,
  Slot,
  WearRequest,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";

export class WardrobeService {
  constructor(private socketService: SocketService) {}

  async wear(slot: Slot, itemId: number): Promise<void> {
    const request: WearRequest = {
      slot,
      itemId,
    };
    await this.socketService.emit(RequestFromClient.Wear, request);
  }
}
