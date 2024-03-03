import {
  CharacterPose,
  EquippedItem,
  GameObject,
  Item,
  NPCCode,
  Position,
  Room,
  RoomTransitArea,
  Slot,
  isNPCObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { RoomService } from "./room-service";

@singleton()
export class RoomStoreService {
  constructor(
    @inject(RoomService)
    private roomService: RoomService,
  ) {}

  async getTransitAreas(roomId: number): Promise<RoomTransitArea[]> {
    const room = await this.get(roomId);
    return room.transitAreas;
  }

  async isNpcInRoom(roomId: number, npcCode: NPCCode): Promise<boolean> {
    const room = await this.get(roomId);
    return room.objects
      .filter(isNPCObject)
      .some((object) => object.code === npcCode);
  }

  async getObjectIdByPlayerId(
    roomId: number,
    playerId: number,
  ): Promise<number | undefined> {
    const room = await this.get(roomId);
    return room.objects
      .filter(isPlayerObject)
      .find((object) => object.playerId === playerId)?.id;
  }

  async getPlayerIdByObjectId(
    roomId: number,
    objectId: number,
  ): Promise<number | undefined> {
    const room = await this.get(roomId);
    return room.objects
      .filter(isPlayerObject)
      .find((object) => object.id === objectId)?.playerId;
  }

  async getPositionByObjectId(
    roomId: number,
    objectId: number,
  ): Promise<Position | undefined> {
    const room = await this.get(roomId);
    return room.objects.find((object) => object.id === objectId)?.position;
  }

  async getPlayersIdsInRoom(roomId: number): Promise<number[]> {
    const room = await this.get(roomId);
    return room.objects.filter(isPlayerObject).map((object) => object.playerId);
  }

  async get(roomId: number): Promise<Room> {
    return await this.roomService.getRoomById(roomId);
  }

  async updateObjectPostion(
    roomId: number,
    objectId: number,
    position: Position,
  ): Promise<void> {
    await this.roomService.updateObjectPostion(roomId, objectId, position);
  }

  async updateNpcPose(
    roomId: number,
    objectId: number,
    pose: CharacterPose,
  ): Promise<void> {
    await this.roomService.updateNpcPose(roomId, objectId, pose);
  }

  async updateNpcEquippedItem(
    roomId: number,
    objectId: number,
    slot: Slot,
    item?: EquippedItem,
  ): Promise<void> {
    await this.roomService.updateNpcEquippedItem(roomId, objectId, slot, item);
  }

  async addItemsToNpc(
    roomId: number,
    objectId: number,
    items: Item[],
  ): Promise<void> {
    await this.roomService.addItemsToNpc(roomId, objectId, items);
  }

  async addObject(roomId: number, object: GameObject): Promise<void> {
    await this.roomService.addObject(roomId, object);
  }

  async removeObjectById(roomId: number, objectId: number): Promise<void> {
    await this.roomService.removeObjectById(roomId, objectId);
  }
}
