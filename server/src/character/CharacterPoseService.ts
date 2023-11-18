import type { CharacterPose, PlayerObject, World } from "shared";
import { type PlayerStoreService } from "../player/PlayerStoreService";
import { type WorldService } from "../world/WorldService";

export class CharacterPoseService {
  constructor(
    private worldService: WorldService,
    private playerStoreService: PlayerStoreService
  ) {}

  async changePose(
    world: World,
    playerObject: PlayerObject,
    pose: CharacterPose
  ): Promise<void> {
    await this.playerStoreService.update(
      playerObject.playerId,
      (player) => (player.character.pose = pose)
    );
    for (const session of this.worldService.getSessionsFromWorld(world)) {
      session.socket.emit("change_pose", {
        playerId: playerObject.playerId,
        pose,
      });
    }
  }
}
