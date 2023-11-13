import {
  playerStoreService,
  type PlayerStoreService,
} from "../player/PlayerStoreService";
import { worldService, type WorldService } from "../world/WorldService";
import { type PlayerObject } from "../world/model/PlayerObject";
import { type World } from "../world/model/World";
import { type CharacterPose } from "./model/CharacterPose";

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

export const characterPoseService = new CharacterPoseService(
  worldService,
  playerStoreService
);
