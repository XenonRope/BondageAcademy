import type {
  GameObject,
  Room,
  RoomRestrictions,
  RoomTransitArea,
} from "shared";
import { type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { type RoomService } from "./RoomService";

export interface RoomCreateParams {
  code?: string;
  name?: string;
  customName?: string;
  persistent: boolean;
  width: number;
  height: number;
  transitAreas: RoomTransitArea[];
  restrictions: RoomRestrictions;
  objects: GameObject[];
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
      customName: params.customName,
      persistent: params.persistent,
      width: params.width,
      height: params.height,
      transitAreas: params.transitAreas,
      restrictions: params.restrictions,
      objects: params.objects,
    };
    await this.roomService.insertRoom(room);

    return room;
  }
}
