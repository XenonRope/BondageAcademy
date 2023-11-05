import { type Room } from "../room/model/Room";
import {
  isBlockRoomObject,
  type BlockRoomObject,
} from "../room/model/objects/BlockRoomObject";
import { type RoomObject } from "../room/model/objects/RoomObject";
import {
  worldObjectIdProvider,
  type WorldObjectIdProvider,
} from "./WorldObjectIdProvider";
import { type BlockObject } from "./model/BlockObject";
import { WorldObjectType, type WorldObject } from "./model/WorldObject";

export class WorldObjectCreator {
  constructor(private worldObjectIdProvider: WorldObjectIdProvider) {}

  createObjectsInRoom(room: Room): WorldObject[] {
    return (room.objects ?? [])
      .map((roomObject) => this.createObject(roomObject))
      .filter((object): object is WorldObject => object != null);
  }

  private createObject(roomObject: RoomObject): WorldObject | undefined {
    if (isBlockRoomObject(roomObject)) {
      return this.createBlockObject(roomObject);
    }
    return undefined;
  }

  private createBlockObject(roomObject: BlockRoomObject): BlockObject {
    return {
      type: WorldObjectType.Block,
      id: this.worldObjectIdProvider.getNextId(),
      position: roomObject.position,
      color: roomObject.color,
    };
  }
}

export const worldObjectCreator = new WorldObjectCreator(worldObjectIdProvider);
