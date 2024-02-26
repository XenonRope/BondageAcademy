import {
  CreateRoomRequestSchema,
  CreateRoomResponse,
  ROOM_DESCRIPTION_MAX_LENGHT,
  ROOM_NAME_MAX_LENGHT,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { inject, singleton } from "tsyringe";
import { PlayerStoreService } from "../player/player-store-service";
import { Session } from "../session/model/session";
import { RoomCreationService } from "./room-creation-service";
import { RoomJoinService } from "./room-join-service";
import { RoomService } from "./room-service";
import { RoomStoreService } from "./room-store-service";
import { RoomUtilsService } from "./room-utils-service";

@singleton()
export class RoomCreationApi {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(RoomService)
    private roomService: RoomService,
    @inject(RoomCreationService)
    private roomCreationService: RoomCreationService,
    @inject(RoomJoinService)
    private roomJoinService: RoomJoinService,
    @inject(RoomUtilsService)
    private roomUtilsService: RoomUtilsService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
  ) {}

  async createRoom(
    request: unknown,
    session: Session,
  ): Promise<CreateRoomResponse> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    const roomId = await this.playerStoreService.getPlayerRoomId(
      session.playerId,
    );
    if (roomId) {
      throw new Error("Cannot create room while in a room");
    }
    const { roomCode, name, description, publicRoom } = await tPromise.decode(
      CreateRoomRequestSchema,
      request,
    );
    if (name && name.length > ROOM_NAME_MAX_LENGHT) {
      throw new Error(
        `Room name has length ${name.length} but max length is ${ROOM_NAME_MAX_LENGHT}`,
      );
    }
    if (description && description.length > ROOM_DESCRIPTION_MAX_LENGHT) {
      throw new Error(
        `Room description has length ${description.length} but max length is ${ROOM_DESCRIPTION_MAX_LENGHT}`,
      );
    }
    const templateRoomId = await this.roomService.getRoomIdByCode(roomCode);
    const templateRoom = await this.roomStoreService.get(templateRoomId);
    if (!templateRoom.template) {
      throw new Error(`Room ${templateRoomId} is not a template room`);
    }
    const room = await this.roomCreationService.createRoomFromTemplate({
      templateRoomId,
      customName: name,
      description,
      restrictions: {
        players:
          templateRoom.templateSettings?.singleplayer || !publicRoom
            ? [session.playerId]
            : undefined,
      },
    });
    await this.roomJoinService.joinRoom(session.playerId, room.id);
    return { state: await this.roomUtilsService.getRoomState(room.id) };
  }
}
