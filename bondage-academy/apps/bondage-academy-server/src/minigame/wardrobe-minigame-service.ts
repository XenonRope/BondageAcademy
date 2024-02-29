import {
  Actor,
  ChangeWardrobeMinigameStake,
  ClickMinigameChallange,
  Item,
  MinigameChallangeType,
  MinigameStakeType,
  PhantomItem,
  Slot,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ActorStoreService } from "../actor/actor-store-service";
import { MinigameService } from "./minigame-service";

@singleton()
export class WardrobeMinigameService {
  constructor(
    @inject(MinigameService) private minigameService: MinigameService,
    @inject(ActorStoreService) private actorStoreService: ActorStoreService,
  ) {}

  async startChangeWardrobeMinigame(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    item?: Item | PhantomItem;
  }): Promise<void> {
    const currentItem = await this.actorStoreService.getEquippedItem(
      params.target,
      params.slot,
    );
    const challange: ClickMinigameChallange = {
      type: MinigameChallangeType.Click,
    };
    const stake: ChangeWardrobeMinigameStake = {
      type: MinigameStakeType.ChangeWardrobe,
      slot: params.slot,
      item: params.item,
      currentItem: currentItem?.item,
    };
    await this.minigameService.startMinigame({
      roomId: await this.actorStoreService.getRoomId(params.actor),
      actor: params.actor,
      target: params.target,
      challange,
      stake,
      durationInMs: 5000,
    });
  }
}
