import { DialogueOption } from "../model/dialogue-option";
import { NPCCode } from "../model/npc-object";

export const whoAreYou: DialogueOption = {
  condition: () => true,
  npcCode: NPCCode.Headmistress,
  content: "dialogue.whoAreYou",
};
