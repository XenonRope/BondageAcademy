import {
  DialogueOption,
  DialogueOptionContext,
  NPCCode,
  RequestFromClient,
  UseDialogueOptionRequest,
  dialogueOptions,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { SocketService } from "../../common/socket-service";
import type { Store } from "../../store/model/store";
import { STORE } from "../../store/store-service";

@singleton()
export class DialogueOptionService {
  constructor(
    @inject(STORE) private store: Store,
    @inject(SocketService) private socketService: SocketService,
  ) {}

  getAvailableDialogueOptions(): DialogueOption[] {
    if (!this.store.room) {
      return [];
    }

    const npcCodes: NPCCode[] = (this.store.objects ?? [])
      .filter(isNPCObject)
      .map((npcObject) => npcObject.code);
    const context: DialogueOptionContext = {
      roomId: this.store.room.id,
    };

    return dialogueOptions.filter(
      (option) =>
        npcCodes.includes(option.npcCode) && option.condition(context),
    );
  }

  async useDialogueOption(option: DialogueOption): Promise<void> {
    const request: UseDialogueOptionRequest = {
      npcCode: option.npcCode,
      content: option.content,
    };
    await this.socketService.emit(RequestFromClient.UseDialogueOption, request);
  }
}
