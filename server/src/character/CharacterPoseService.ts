import { worldService, type WorldService } from "../world/WorldService";
import { type PlayerObject } from "../world/model/PlayerObject";
import { type World } from "../world/model/World";
import { type CharacterPose } from "./model/CharacterPose";

export class CharacterPoseService {
  constructor(private worldService: WorldService) {}

  changePose(
    world: World,
    playerObject: PlayerObject,
    pose: CharacterPose
  ): void {
    playerObject.player.character.pose = pose;
    for (const session of this.worldService.getSessionsFromWorld(world)) {
      session.socket.emit("change_pose", {
        playerId: playerObject.player.id,
        pose,
      });
    }
  }
}

export const characterPoseService = new CharacterPoseService(worldService);
