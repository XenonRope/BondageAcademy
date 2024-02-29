import {
  Actor,
  ItemReference,
  PhantomItem,
  Slot,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { WardrobeMinigameService } from "../minigame/wardrobe-minigame-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";
import { WardrobeService } from "./wardrobe-service";

@singleton()
export class WardrobeChangeService {
  constructor(
    @inject(WardrobeService)
    private wardrobeService: WardrobeService,
    @inject(WardrobeConditionChecker)
    private wardrobeConditionChecker: WardrobeConditionChecker,
    @inject(WardrobeMinigameService)
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
      actor: actor.actor,
      target: target.actor,
      slot: params.slot,
      item,
    });
  }
}
