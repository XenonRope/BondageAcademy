import {
  CustomizeItemRequest,
  ItemCustomization,
  RequestFromClient,
  Slot,
  WearRequest,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";

export class WardrobeService {
  constructor(private socketService: SocketService) {}

  async wear(
    targetPlayerId: number,
    slot: Slot,
    itemId?: number
  ): Promise<void> {
    const request: WearRequest = {
      targetPlayerId,
      slot,
      itemId,
    };
    await this.socketService.emit(RequestFromClient.Wear, request);
  }

  async customizeItem(
    targetPlayerId: number,
    slot: Slot,
    customizations: ItemCustomization[]
  ): Promise<void> {
    const request: CustomizeItemRequest = {
      targetPlayerId,
      slot,
      customizations,
    };
    await this.socketService.emit(RequestFromClient.CustomizeItem, request);
  }
}
