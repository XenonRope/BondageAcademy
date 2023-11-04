import {
  roomCreationService,
  type RoomCreationService,
} from "./RoomCreationService";
import { roomService, type RoomService } from "./RoomService";
import { RoomCode } from "./model/RoomCode";

export class RoomInitializationService {
  constructor(
    private roomService: RoomService,
    private roomCreationService: RoomCreationService
  ) {}

  async initializeRooms(): Promise<void> {
    const mainRoom = await this.roomService.getRoomByCode(RoomCode.Main);
    if (mainRoom == null) {
      await this.roomCreationService.createRoom({
        code: RoomCode.Main,
        name: "Main room",
      });
    }
  }
}

export const roomInitializationService = new RoomInitializationService(
  roomService,
  roomCreationService
);
