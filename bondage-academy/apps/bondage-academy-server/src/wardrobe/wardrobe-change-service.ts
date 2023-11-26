import { Actor, Slot } from "@bondage-academy/bondage-academy-model";
import { WardrobeMinigameService } from "../minigame/wardrobe-minigame-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";
import { WardrobeService } from "./wardrobe-service";

export class WardrobeChangeService {
  constructor(
    private wardrobeService: WardrobeService,
    private wardrobeConditionChecker: WardrobeConditionChecker,
    private wardrobeMinigameService: WardrobeMinigameService
  ) {}

  async wear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    itemId?: number;
  }): Promise<void> {
    const { actorPlayer, targetPlayer } =
      await this.wardrobeConditionChecker.assertCanWear(params);
    if (actorPlayer.id === targetPlayer.id) {
      await this.wardrobeService.wear(params);
      return;
    }
    await this.wardrobeMinigameService.startChangeWardrobeMinigame(params);
  }
}
