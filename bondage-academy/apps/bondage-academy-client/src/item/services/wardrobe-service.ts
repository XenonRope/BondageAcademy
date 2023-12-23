import {
  CustomizeItemRequest,
  ItemCustomization,
  ItemReference,
  PhantomItem,
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
    item?: ItemReference | PhantomItem
  ): Promise<void> {
    const request: WearRequest = {
      targetPlayerId,
      slot,
      item,
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
