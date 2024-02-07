import {
  ActionRequestSchema,
  ActorType,
  PlayerActor,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { ActionExecutorService } from "./action-executor-service";

export class ActionApi {
  constructor(
    private actionExecutorService: ActionExecutorService,
    private minigameService: MinigameService
  ) {}

  async executeAction(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);
    const { action } = await tPromise.decode(ActionRequestSchema, request);
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: session.playerId,
    };
    await this.actionExecutorService.executeAction(actor, action);
  }
}
