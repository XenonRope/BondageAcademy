import {
  DialogueOption,
  DialogueOptionContext,
  NPCCode,
  dialogueOptions,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { Store } from "../../store/model/store";

export class DialogueOptionService {
  constructor(private store: Store) {}

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
      (option) => npcCodes.includes(option.npcCode) && option.condition(context)
    );
  }
}
