import {
  Actor,
  ChangeWardrobeMinigameStake,
  ClickMinigameChallange,
  MinigameChallangeType,
  MinigameStakeType,
  Slot,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { MinigameService } from "./minigame-service";

export class WardrobeMinigameService {
  constructor(
    private minigameService: MinigameService,
    private playerStoreService: PlayerStoreService
  ) {}

  async startChangeWardrobeMinigame(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    itemId?: number;
  }): Promise<void> {
    if (!isPlayerActor(params.actor)) {
      throw new Error("Actor is not player");
    }
    const player = await this.playerStoreService.get(params.actor.playerId);
    const challange: ClickMinigameChallange = {
      type: MinigameChallangeType.Click,
    };
    const stake: ChangeWardrobeMinigameStake = {
      type: MinigameStakeType.ChangeWardrobe,
      slot: params.slot,
      itemId: params.itemId,
    };
    await this.minigameService.startMinigame({
      roomId: player.roomId,
      actor: params.actor,
      target: params.target,
      challange,
      stake,
      durationInMs: 5000,
    });
  }
}
