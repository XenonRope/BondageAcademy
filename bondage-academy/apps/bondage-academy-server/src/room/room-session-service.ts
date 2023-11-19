import { isPlayerObject } from "@bondage-academy/bondage-academy-model";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";
import { RoomStoreService } from "./room-store-service";

export class RoomSessionService {
  constructor(
    private sessionService: SessionService,
    private roomStoreService: RoomStoreService
  ) {}

  async getSessionsInRoom(roomId: number): Promise<Session[]> {
    const room = await this.roomStoreService.get(roomId);
    return room.objects
      .filter(isPlayerObject)
      .map((playerObject) =>
        this.sessionService.getSessionByPlayerId(playerObject.playerId)
      )
      .flatMap((session) => (session ? [session] : []));
  }
}
