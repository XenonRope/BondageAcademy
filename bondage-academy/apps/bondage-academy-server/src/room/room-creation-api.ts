import {
  CreateRoomRequestSchema,
  CreateRoomResponse,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { Session } from "../session/model/session";
import { RoomCreationService } from "./room-creation-service";
import { RoomJoinService } from "./room-join-service";
import { RoomService } from "./room-service";
import { RoomStoreService } from "./room-store-service";
import { RoomUtilsService } from "./room-utils-service";

export class RoomCreationApi {
  constructor(
    private roomStoreService: RoomStoreService,
    private roomService: RoomService,
    private roomCreationService: RoomCreationService,
    private roomJoinService: RoomJoinService,
    private roomUtilsService: RoomUtilsService
  ) {}

  async createRoom(
    request: unknown,
    session: Session
  ): Promise<CreateRoomResponse> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    const { roomCode } = await tPromise.decode(
      CreateRoomRequestSchema,
      request
    );
    const templateRoomId = await this.roomService.getRoomIdByCode(roomCode);
    const templateRoom = await this.roomStoreService.get(templateRoomId);
    if (
      !templateRoom.template ||
      !templateRoom.templateSettings?.singleplayer
    ) {
      throw new Error(
        `Room ${templateRoomId} is not a singleplayer template room`
      );
    }
    const room = await this.roomCreationService.createRoomFromTemplate({
      templateRoomId,
      restrictions: {
        players: [session.playerId],
      },
    });
    await this.roomJoinService.joinRoom(session.playerId, room.id);
    return await this.roomUtilsService.getRoomAndPlayers(room.id);
  }
}
