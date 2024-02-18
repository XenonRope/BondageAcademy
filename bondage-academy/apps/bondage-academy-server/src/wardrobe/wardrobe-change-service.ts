import {
  Actor,
  ItemReference,
  PhantomItem,
  Slot,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { WardrobeMinigameService } from "../minigame/wardrobe-minigame-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";
import { WardrobeService } from "./wardrobe-service";

export class WardrobeChangeService {
  constructor(
    private wardrobeService: WardrobeService,
    private wardrobeConditionChecker: WardrobeConditionChecker,
    private wardrobeMinigameService: WardrobeMinigameService,
  ) {}

  async wear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    item?: ItemReference | PhantomItem;
  }): Promise<void> {
    const { actor, target, item } =
      await this.wardrobeConditionChecker.assertCanWear({
        actor: params.actor,
        target: params.target,
        slot: params.slot,
        item: params.item,
      });
    if (
      isPlayerActor(params.actor) &&
      isPlayerActor(params.target) &&
      params.actor.playerId === params.target.playerId
    ) {
      await this.wardrobeService.wear(params);
      return;
    }
    await this.wardrobeMinigameService.startChangeWardrobeMinigame({
      actor,
      target,
      slot: params.slot,
      item,
    });
  }
}
