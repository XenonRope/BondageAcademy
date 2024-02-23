import {
  ChangeWardrobeMinigameStake,
  ClickMinigameChallange,
  Item,
  MinigameChallangeType,
  MinigameStakeType,
  PhantomItem,
  Slot,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ActorData } from "../actor/actor-data";
import { MinigameService } from "./minigame-service";

@singleton()
export class WardrobeMinigameService {
  constructor(
    @inject(MinigameService) private minigameService: MinigameService,
  ) {}

  async startChangeWardrobeMinigame(params: {
    actor: ActorData;
    target: ActorData;
    slot: Slot;
    item?: Item | PhantomItem;
  }): Promise<void> {
    const currentItem = params.target.character.wearables[params.slot];
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
      roomId: params.actor.roomId,
      actor: params.actor.actor,
      target: params.target.actor,
      challange,
      stake,
      durationInMs: 5000,
    });
  }
}
