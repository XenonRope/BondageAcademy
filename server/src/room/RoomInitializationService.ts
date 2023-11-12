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
    await this.initializeTurotialRoom();
    await this.initializePrisonCellRoom();
  }

  private async initializeTurotialRoom(): Promise<void> {
    const room = await this.roomService.getRoomByCode(RoomCode.Introduction);
    if (room != null) {
      return;
    }

    await this.roomCreationService.createRoom({
      code: RoomCode.Introduction,
      name: "rooms.intrdocution",
      persistent: false,
      width: 10,
      height: 10,
      transitAreas: [{ x: 2, y: 1, width: 1, height: 1 }],
      restrictions: {
        singlePlayer: true,
      },
      objects: [
        this.createBlock(0, 0),
        this.createBlock(1, 0),
        this.createDoor(2, 0),
        this.createBlock(3, 0),
        this.createBlock(4, 0),
        this.createBlock(5, 0),
        this.createBlock(6, 0),
        this.createBlock(7, 0),
        this.createBlock(8, 0),
        this.createBlock(9, 0),
        this.createBlock(9, 1),
        this.createBlock(9, 2),
        this.createBlock(9, 3),
        this.createBlock(9, 4),
        this.createBlock(9, 5),
        this.createBlock(9, 6),
        this.createBlock(9, 7),
        this.createBlock(9, 8),
        this.createBlock(9, 9),
        this.createBlock(8, 9),
        this.createBlock(7, 9),
        this.createBlock(6, 9),
        this.createBlock(5, 9),
        this.createBlock(4, 9),
        this.createBlock(3, 9),
        this.createBlock(2, 9),
        this.createBlock(1, 9),
        this.createBlock(0, 9),
        this.createBlock(0, 8),
        this.createBlock(0, 7),
        this.createBlock(0, 6),
        this.createBlock(0, 5),
        this.createBlock(0, 4),
        this.createBlock(0, 3),
        this.createBlock(0, 2),
        this.createBlock(0, 1),
      ],
    });
  }

  private async initializePrisonCellRoom(): Promise<void> {
    const room = await this.roomService.getRoomByCode(RoomCode.PrisonCell);
    if (room != null) {
      return;
    }

    await this.roomCreationService.createRoom({
      code: RoomCode.PrisonCell,
      name: "rooms.prisonCell",
      persistent: false,
      width: 6,
      height: 5,
      transitAreas: [
        { x: 5, y: 2, width: 1, height: 1 },
        { x: 4, y: 2, width: 1, height: 1 },
      ],
      restrictions: {},
      objects: [
        this.createBlock(0, 0),
        this.createBlock(1, 0),
        this.createBlock(2, 0),
        this.createBlock(3, 0),
        this.createBlock(4, 0),
        this.createBlock(5, 0),
        this.createBlock(5, 1),
        this.createBlock(5, 2),
        this.createBlock(5, 3),
        this.createBlock(5, 4),
        this.createBlock(4, 4),
        this.createBlock(3, 4),
        this.createBlock(2, 4),
        this.createBlock(1, 4),
        this.createBlock(0, 4),
        this.createBlock(0, 3),
        this.createBlock(0, 2),
        this.createBlock(0, 1),
      ],
    });
  }

  private createBlock(x: number, y: number): BlockRoomObject {
    return {
      type: RoomObjectType.Block,
      position: { x, y },
      color: BlockColor.Red,
    };
  }

  private createDoor(x: number, y: number): BlockRoomObject {
    return {
      type: RoomObjectType.Block,
      position: { x, y },
      color: BlockColor.Green,
    };
  }
}

export const roomInitializationService = new RoomInitializationService(
  roomService,
  roomCreationService
);
