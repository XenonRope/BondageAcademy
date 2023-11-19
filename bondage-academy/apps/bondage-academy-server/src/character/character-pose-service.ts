import { CharacterPose } from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomSessionService } from "../room/room-session-service";

export class CharacterPoseService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private roomSessionService: RoomSessionService
  ) {}

  async changePose(playerId: number, pose: CharacterPose): Promise<void> {
    await this.playerStoreService.update(
      playerId,
      (player) => (player.character.pose = pose)
    );
    const player = await this.playerStoreService.get(playerId);
    if (player.roomId == null) {
      return;
    }
    const sessions = await this.roomSessionService.getSessionsInRoom(
      player.roomId
    );
    for (const session of sessions) {
      session.socket.emit("change_pose", {
        playerId,
        pose,
      });
    }
  }
}
