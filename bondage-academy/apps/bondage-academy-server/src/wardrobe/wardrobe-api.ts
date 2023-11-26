import {
  ActorType,
  PlayerActor,
  Slot,
  WearRequestSchema,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { parseEnum } from "../api/utils/parsers";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { WardrobeChangeService } from "./wardrobe-change-service";

export class WardrobeApi {
  constructor(
    private wardrobeChangeService: WardrobeChangeService,
    private minigameService: MinigameService
  ) {}

  async wear(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    if (this.minigameService.getMinigameByPlayerId(session.playerId)) {
      throw new Error("User is during minigame");
    }
    const { targetPlayerId, slot, itemId } = await tPromise.decode(
      WearRequestSchema,
      request
    );
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: session.playerId,
    };
    const target: PlayerActor = {
      type: ActorType.Player,
      playerId: targetPlayerId,
    };
    await this.wardrobeChangeService.wear({
      actor,
      target,
      slot: parseEnum(slot, Slot),
      itemId,
    });
  }
}
