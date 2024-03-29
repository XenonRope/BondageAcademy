import { Room, isPlayerObject } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { PlayerStoreService } from "../player/player-store-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomSessionService {
  constructor(
    @inject(SessionService)
    private sessionService: SessionService,
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
  ) {}

  async getSessionsInRoomOfPlayer(playerId: number): Promise<Session[]> {
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
      const session = this.sessionService.getSessionByPlayerId(playerId);
      return session ? [session] : [];
    }
    return await this.getSessionsByRoomId(roomId);
  }

  async getSessionsByRoomId(roomId: number): Promise<Session[]> {
    return (await this.roomStoreService.getPlayersIdsInRoom(roomId))
      .map((playerId) => this.sessionService.getSessionByPlayerId(playerId))
      .flatMap((session) => (session ? [session] : []));
  }

  getSessionsInRoom(room: Room): Session[] {
    return room.objects
      .filter(isPlayerObject)
      .map((playerObject) =>
        this.sessionService.getSessionByPlayerId(playerObject.playerId),
      )
      .flatMap((session) => (session ? [session] : []));
  }
}
