import { DialogueOption } from "../model/dialogue-option";

export interface UpdateDialogueOptionsEvent {
  dialogueOptionsToAdd: DialogueOption[];
  dialogueOptionsToRemove: DialogueOption[];
}
