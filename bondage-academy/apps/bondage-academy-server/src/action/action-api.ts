import {
  ActionRequestSchema,
  ActorType,
  PlayerActor,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { Session } from "../session/model/session";
import { ActionService } from "./action-service";

export class ActionApi {
  constructor(private actionService: ActionService) {}

  async executeAction(request: unknown, session: Session): Promise<void> {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    const { action } = await tPromise.decode(ActionRequestSchema, request);
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: session.playerId,
    };
    await this.actionService.executeAction(actor, action);
  }
}