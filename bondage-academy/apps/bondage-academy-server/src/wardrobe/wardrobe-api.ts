import {
  ActorType,
  CustomizeItemRequest,
  PlayerActor,
  Slot,
  WearRequestSchema,
  prepareActorByPlayerId,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { inject, singleton } from "tsyringe";
import { parseEnum } from "../api/utils/parsers";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { WardrobeChangeService } from "./wardrobe-change-service";
import { WardrobeCustomizationService } from "./wardrobe-customization-service";

@singleton()
export class WardrobeApi {
  constructor(
    @inject(WardrobeChangeService)
    private wardrobeChangeService: WardrobeChangeService,
    @inject(MinigameService)
    private minigameService: MinigameService,
    @inject(WardrobeCustomizationService)
    private wardroveCustomizationService: WardrobeCustomizationService,
  ) {}

  async wear(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);
    const { target, slot, item } = await tPromise.decode(
      WearRequestSchema,
      request,
    );
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: session.playerId,
    };
    await this.wardrobeChangeService.wear({
      actor,
      target,
      slot: parseEnum(slot, Slot),
      item,
    });
  }

  async customizeItem(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);
    const { target, slot, customizations } = await tPromise.decode(
      CustomizeItemRequest,
      request,
    );
    await this.wardroveCustomizationService.customizeItem({
      actor: prepareActorByPlayerId(session.playerId),
      target,
      slot,
      customizations,
    });
  }
}
