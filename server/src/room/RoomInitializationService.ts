import {
  roomCreationService,
  type RoomCreationService,
} from "./RoomCreationService";
import { roomService, type RoomService } from "./RoomService";
import { RoomCode } from "./model/RoomCode";
import {
  BlockColor,
  type BlockRoomObject,
} from "./model/objects/BlockRoomObject";
import { RoomObjectType } from "./model/objects/RoomObject";

export class RoomInitializationService {
  constructor(
    private roomService: RoomService,
    private roomCreationService: RoomCreationService
  ) {}

  async initializeRooms(): Promise<void> {
    const mainRoom = await this.roomService.getRoomByCode(RoomCode.Main);
    if (mainRoom == null) {
      const firstBlock: BlockRoomObject = {
        type: RoomObjectType.Block,
        position: { x: 1, y: 0 },
        color: BlockColor.Red,
      };
      const secondBlock: BlockRoomObject = {
        type: RoomObjectType.Block,
        position: { x: 1, y: 2 },
        color: BlockColor.Green,
      };
      await this.roomCreationService.createRoom({
        code: RoomCode.Main,
        name: "Main room",
        objects: [firstBlock, secondBlock],
      });
    }
  }
}

export const roomInitializationService = new RoomInitializationService(
  roomService,
  roomCreationService
);
