import {
  Slot,
  WearRequestSchema,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { parseEnum } from "../api/utils/parsers";
import { Session } from "../session/model/session";
import { WardrobeService } from "./wardrobe-service";

export class WardrobeApi {
  constructor(private wardrobeService: WardrobeService) {}

  async wear(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    const { targetPlayerId, slot, itemId } = await tPromise.decode(
      WearRequestSchema,
      request
    );
    await this.wardrobeService.wear(
      session.playerId,
      targetPlayerId,
      parseEnum(slot, Slot),
      itemId
    );
  }
}
