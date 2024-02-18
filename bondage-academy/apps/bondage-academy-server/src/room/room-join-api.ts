import {
  JoinRoomRequestSchema,
  JoinRoomResponse,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { Session } from "../session/model/session";
import { RoomJoinService } from "./room-join-service";
import { RoomUtilsService } from "./room-utils-service";

export class RoomJoinApi {
  constructor(
    private roomJoinService: RoomJoinService,
    private roomUtilsService: RoomUtilsService,
  ) {}
  async joinRoom(
    request: unknown,
    session: Session,
  ): Promise<JoinRoomResponse> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    const { roomId } = await tPromise.decode(JoinRoomRequestSchema, request);
    await this.roomJoinService.joinRoom(session.playerId, roomId);
    return { state: await this.roomUtilsService.getRoomState(roomId) };
  }
}
