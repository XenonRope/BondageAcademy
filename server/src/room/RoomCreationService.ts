import { sequences, type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { roomService, type RoomService } from "./RoomService";
import { type Room } from "./model/Room";

export interface RoomCreateParams {
  code: string;
  name: string;
}

export class RoomCreationService {
  constructor(
    private roomService: RoomService,
    private sequences: Sequences
  ) {}

  async createRoom(params: RoomCreateParams): Promise<Room> {
    const id = await this.sequences.getNext(SequenceName.ROOM);
    const room: Room = {
      id,
      code: params.code,
      name: params.name,
    };
    await this.roomService.insertRoom(room);

    return room;
  }
}

export const roomCreationService = new RoomCreationService(
  roomService,
  sequences
);
