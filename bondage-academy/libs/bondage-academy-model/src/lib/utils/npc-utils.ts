import { DictionaryKey } from "../i18n/dictionary";
import { NPCCode } from "../model/npc-object";

export class NPCUtils {
  static getDictionaryKey(npcCode: NPCCode): DictionaryKey {
    switch (npcCode) {
      case NPCCode.Headmistress:
        return "npc.headmistress";
      case NPCCode.PrisonGuard:
        return "npc.prisonGuard";
    }
  }
}
