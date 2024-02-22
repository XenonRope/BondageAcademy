import {
  DialogueOption,
  DialogueOptionContext,
  NPCCode,
  RequestFromClient,
  UseDialogueOptionRequest,
  dialogueOptions,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";
import { Store } from "../../store/model/store";

export class DialogueOptionService {
  static inject = ["store", "socketService"] as const;
  constructor(
    private store: Store,
    private socketService: SocketService,
  ) {}

  getAvailableDialogueOptions(): DialogueOption[] {
    if (!this.store.room) {
      return [];
    }

    const npcCodes: NPCCode[] = this.store.room.objects
      .filter(isNPCObject)
      .map((npcObject) => npcObject.code);
    const context: DialogueOptionContext = {
      room: this.store.room,
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
