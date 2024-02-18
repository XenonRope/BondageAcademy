import { isPlayerObject } from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";
import { RoomStoreService } from "./room-store-service";

export class RoomSessionService {
  constructor(
    private sessionService: SessionService,
    private roomStoreService: RoomStoreService,
    private playerStoreService: PlayerStoreService,
  ) {}

  async getSessionsInRoomOfPlayer(playerId: number): Promise<Session[]> {
    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      return session ? [session] : [];
    }
    return await this.getSessionsInRoom(player.roomId);
  }

  async getSessionsInRoom(roomId: number): Promise<Session[]> {
    const room = await this.roomStoreService.get(roomId);
    return room.objects
      .filter(isPlayerObject)
      .map((playerObject) =>
        this.sessionService.getSessionByPlayerId(playerObject.playerId),
      )
      .flatMap((session) => (session ? [session] : []));
  }
}
