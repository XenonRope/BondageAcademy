import {
  GameObject,
  Room,
  RoomRestrictions,
  RoomTemplateSettings,
  RoomTransitArea,
} from "@bondage-academy/bondage-academy-model";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";
import { RoomService } from "./room-service";
import { RoomStoreService } from "./room-store-service";

export interface CreateRoomFromTemplateParams {
  templateRoomId: number;
  customName?: string;
  description?: string;
  restrictions?: RoomRestrictions;
}

export interface CreateTemplateRoomParams {
  code?: string;
  name?: string;
  width: number;
  height: number;
  templateSettings: RoomTemplateSettings;
  transitAreas: RoomTransitArea[];
  objects: GameObject[];
}

export class RoomCreationService {
  constructor(
    private roomService: RoomService,
    private sequences: Sequences,
    private roomStoreService: RoomStoreService
  ) {}

  async createRoomFromTemplate(
    params: CreateRoomFromTemplateParams
  ): Promise<Room> {
    const templateRoom = await this.roomStoreService.get(params.templateRoomId);
    if (!templateRoom.template) {
      throw new Error(`Room ${params.templateRoomId} is not a template room`);
    }
    const room: Room = {
      id: await this.getRoomId(),
      name: templateRoom.name,
      customName: params.customName,
      description: params.description,
      template: false,
      templateRoomId: params.templateRoomId,
      width: templateRoom.width,
      height: templateRoom.height,
      transitAreas: structuredClone(templateRoom.transitAreas),
      restrictions: params.restrictions,
      objects: structuredClone(templateRoom.objects),
    };
    await this.roomService.insertRoom(room);

    return room;
  }

  async createTemplateRoom(params: CreateTemplateRoomParams): Promise<Room> {
    const room: Room = {
      id: await this.getRoomId(),
      code: params.code,
      name: params.name,
      template: true,
      templateSettings: params.templateSettings,
      width: params.width,
      height: params.height,
      transitAreas: params.transitAreas,
      objects: params.objects,
    };
    await this.roomService.insertRoom(room);

    return room;
  }

  private async getRoomId(): Promise<number> {
    return await this.sequences.getNext(SequenceName.ROOM);
  }
}
