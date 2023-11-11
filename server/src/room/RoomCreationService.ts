import { sequences, type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { roomService, type RoomService } from "./RoomService";
import { type Room } from "./model/Room";
import { type RoomObject } from "./model/objects/RoomObject";

export interface RoomCreateParams {
  code: string;
  name: string;
  width: number;
  height: number;
  objects: RoomObject[];
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
      width: params.width,
      height: params.height,
      objects: params.objects,
    };
    await this.roomService.insertRoom(room);

    return room;
  }
}

export const roomCreationService = new RoomCreationService(
  roomService,
  sequences
);
