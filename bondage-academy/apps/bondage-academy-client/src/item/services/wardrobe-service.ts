import {
  Actor,
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
    target: Actor,
    slot: Slot,
    item?: ItemReference | PhantomItem,
  ): Promise<void> {
    const request: WearRequest = {
      target,
      slot,
      item,
    };
    await this.socketService.emit(RequestFromClient.Wear, request);
  }

  async customizeItem(
    target: Actor,
    slot: Slot,
    customizations: ItemCustomization[],
  ): Promise<void> {
    const request: CustomizeItemRequest = {
      target,
      slot,
      customizations,
    };
    await this.socketService.emit(RequestFromClient.CustomizeItem, request);
  }
}
