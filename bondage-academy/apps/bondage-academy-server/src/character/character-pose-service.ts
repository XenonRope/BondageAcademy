import {
  CharacterPose,
  Player,
  SynchronizePlayersEvent,
} from "@bondage-academy/bondage-academy-model";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";

export class CharacterPoseService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private roomSessionService: RoomSessionService,
    private sessionService: SessionService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService
  ) {}

  async changePose(playerId: number, pose: CharacterPose): Promise<void> {
    await this.playerStoreService.update(
      playerId,
      (player) => (player.character.pose = pose)
    );
    const player = await this.playerStoreService.get(playerId);
    const sessions = await this.getSessions(player);
    const event: SynchronizePlayersEvent = {
      updatePlayers: [
        {
          id: player.id,
          pose,
        },
      ],
    };
    this.playerClientSynchronizationService.synchronizePlayers(sessions, event);
  }

  private async getSessions(player: Player): Promise<Session[]> {
    if (player.roomId == null) {
      const session = this.sessionService.getSessionByPlayerId(player.id);
      return session ? [session] : [];
    }
    return await this.roomSessionService.getSessionsInRoom(player.roomId);
  }
}
