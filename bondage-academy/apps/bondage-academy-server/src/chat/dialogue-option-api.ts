import {
  DictionaryKey,
  NPCCode,
  UseDialogueOptionRequestSchema,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";
import { Session } from "../session/model/session";
import { DialogueOptionService } from "./dialogue-option-service";

@singleton()
export class DialogueOptionApi {
  constructor(
    @inject(DialogueOptionService)
    private dialogueOptionService: DialogueOptionService,
    @inject(MinigameService)
    private minigameService: MinigameService,
  ) {}

  async useDialogueOption(request: unknown, session: Session) {
    if (!session.playerId) {
      throw new Error("User is not logged in");
    }
    this.minigameService.assertPlayerIsNotDuringMinigame(session.playerId);

    const { npcCode, content } = await tPromise.decode(
      UseDialogueOptionRequestSchema,
      request,
    );
    await this.dialogueOptionService.useDialogueOption(
      session.playerId,
      npcCode as NPCCode,
      content as DictionaryKey,
    );
  }
}
