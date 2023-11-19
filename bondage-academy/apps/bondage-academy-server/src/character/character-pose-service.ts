import {
  CharacterPose,
  PlayerObject,
  World,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { WorldService } from "../world/world-service";

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
