import {
  DialogueOption,
  DialogueOptionContext,
  DictionaryKey,
  NPCCode,
  dialogueOptions,
} from "@bondage-academy/bondage-academy-model";
import { inject, instanceCachingFactory, registry, singleton } from "tsyringe";
import { token } from "../app/token";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "../room/room-store-service";
import { ScriptService } from "../script/script-service";
import { SessionService } from "../session/session-service";
import { ChatService } from "./chat-service";

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
    const roomId = await this.playerStoreService.getPlayerRoomId(playerId);
    if (!roomId) {
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
    if (!(await this.roomStoreServie.isNpcInRoom(roomId, npcCode))) {
      throw new Error(
        `Cannot use dialogue option with content ${content} becuse NPC ${npcCode} is not in the room`,
      );
    }
    const context: DialogueOptionContext = {
      roomId,
    };
    if (!dialogueOption.condition(context)) {
      throw new Error(
        `Condition of dialogue option with npcCode ${npcCode} and content ${content} not satisfied`,
      );
    }
    const session = this.sessionService.getSessionByPlayerId(playerId);
    if (session) {
      const playerName = await this.playerStoreService.getPlayerName(playerId);
      this.chatService.sendChatMessage([session], {
        speaker: playerName,
        content: { dictionaryKey: content },
      });
    }
    await this.scriptService.onDialogueOptionUse({
      playerId,
      roomId,
      npcCode,
      content,
    });
  }
}
