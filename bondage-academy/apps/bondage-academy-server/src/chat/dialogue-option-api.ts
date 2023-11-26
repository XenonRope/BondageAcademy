import {
  DictionaryKey,
  NPCCode,
  UseDialogueOptionRequestSchema,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { DialogueOptionService } from "./dialogue-option-service";

export class DialogueOptionApi {
  constructor(
    private dialogueOptionService: DialogueOptionService,
    private minigameService: MinigameService
  ) {}

  async useDialogueOption(request: unknown, session: Session) {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    if (this.minigameService.getMinigameByPlayerId(session.playerId)) {
      throw new Error("User is during minigame");
    }

    const { npcCode, content } = await tPromise.decode(
      UseDialogueOptionRequestSchema,
      request
    );
    await this.dialogueOptionService.useDialogueOption(
      session.playerId,
      npcCode as NPCCode,
      content as DictionaryKey
    );
  }
}
