import {
  ChangePoseEvent,
  CharacterPose,
  EventFromServer,
  Player,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";

export class CharacterPoseService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private roomSessionService: RoomSessionService,
    private sessionService: SessionService
  ) {}

  async changePose(playerId: number, pose: CharacterPose): Promise<void> {
    await this.playerStoreService.update(
      playerId,
      (player) => (player.character.pose = pose)
    );
    const player = await this.playerStoreService.get(playerId);
    const sessions = await this.getSessions(player);
    const event: ChangePoseEvent = {
      playerId,
      pose,
    };
    for (const session of sessions) {
      session.socket.emit(EventFromServer.ChangePose, event);
    }
  }

  private async getSessions(player: Player): Promise<Session[]> {
    if (player.roomId == null) {
      const session = this.sessionService.getSessionByPlayerId(player.id);
      return session ? [session] : [];
    }
    return await this.roomSessionService.getSessionsInRoom(player.roomId);
  }
}
