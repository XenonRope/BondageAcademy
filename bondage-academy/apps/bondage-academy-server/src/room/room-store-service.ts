import {
  NPCCode,
  Position,
  Room,
  RoomTransitArea,
  arePositionsEqual,
  isNPCObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { Logger } from "../log/logger";
import { Store } from "../store/store";
import { RoomService } from "./room-service";

@singleton()
export class RoomStoreService extends Store<number, Room> {
  constructor(
    @inject(RoomService)
    private roomService: RoomService,
    @inject(Logger)
    logger: Logger,
  ) {
    super(logger);
  }

  async getRoomSize(
    roomId: number,
  ): Promise<{ width: number; height: number }> {
    const room = await this.get(roomId);
    return { width: room.width, height: room.height };
  }

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

  async isFieldFree(roomId: number, position: Position): Promise<boolean> {
    const room = await this.get(roomId);
    for (const object of room.objects) {
      if (arePositionsEqual(object.position, position)) {
        return false;
      }
    }

    return true;
  }

  protected override fetch(roomId: number): Promise<Room> {
    return this.roomService.getRoomById(roomId);
  }
}
