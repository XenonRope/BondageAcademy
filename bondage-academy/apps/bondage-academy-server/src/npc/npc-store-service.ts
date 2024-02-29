import {
  EquippedItem,
  Slot,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { RoomStoreService } from "../room/room-store-service";

@singleton()
export class NPCStoreService {
  constructor(
    @inject(RoomStoreService) private roomStoreService: RoomStoreService,
  ) {}

  async getEquippedItem(
    objectId: number,
    roomId: number,
    slot: Slot,
  ): Promise<EquippedItem | undefined> {
    const room = await this.roomStoreService.get(roomId);
    const npcObject = room.objects.find((object) => object.id === objectId);
    if (!isNPCObject(npcObject)) {
      throw new Error(`Object ${objectId} in room ${roomId} is not an NPC`);
    }
    return npcObject.character.wearables[slot];
  }
}
