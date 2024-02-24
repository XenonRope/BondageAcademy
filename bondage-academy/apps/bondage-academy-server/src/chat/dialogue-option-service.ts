import {
  DialogueOption,
  DialogueOptionContext,
  DictionaryKey,
  NPCCode,
  dialogueOptions,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "../room/room-store-service";
import { ScriptService } from "../script/script-service";
import { SessionService } from "../session/session-service";
import { ChatService } from "./chat-service";
import { token } from "../app/token";

const DIALOGUE_OPTIONS = token<DialogueOption[]>("dialogueOptions");

@registry([
  {
    token: DIALOGUE_OPTIONS,
    useFactory: instanceCachingFactory(() => dialogueOptions),
  },
])
@singleton()
export class DialogueOptionService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(DIALOGUE_OPTIONS)
    private dialogueOptions: DialogueOption[],
    @inject(RoomStoreService)
    private roomStoreServie: RoomStoreService,
    @inject(ScriptService)
    private scriptService: ScriptService,
    @inject(ChatService)
    private chatService: ChatService,
    @inject(SessionService)
    private sessionService: SessionService,
  ) {}

  async useDialogueOption(
    playerId: number,
    npcCode: NPCCode,
    content: DictionaryKey,
  ): Promise<void> {
    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      throw new Error("Cannot use dialogue option while not in a room");
    }
    const dialogueOption = this.dialogueOptions.find(
      (option) => option.npcCode === npcCode && option.content === content,
    );
    if (!dialogueOption) {
      throw new Error(
        `Dialogue option with npcCode ${npcCode} and content ${content} not found`,
      );
    }
    const room = await this.roomStoreServie.get(player.roomId);
    const npcCodes = room.objects
      .filter(isNPCObject)
      .map((npcObject) => npcObject.code);
    if (!npcCodes.includes(npcCode)) {
      throw new Error(
        `Cannot use dialogue option with content ${content} becuse NPC ${npcCode} is not in the room`,
      );
    }
    const context: DialogueOptionContext = {
      room,
    };
    if (!dialogueOption.condition(context)) {
      throw new Error(
        `Condition of dialogue option with npcCode ${npcCode} and content ${content} not satisfied`,
      );
    }
    const session = this.sessionService.getSessionByPlayerId(playerId);
    if (session) {
      this.chatService.sendChatMessage([session], {
        speaker: player.name,
        content: { dictionaryKey: content },
      });
    }
    await this.scriptService.onDialogueOptionUse({
      playerId,
      roomId: player.roomId,
      npcCode,
      content,
    });
  }
}
