import {
  DialogueOption,
  DialogueOptionContext,
  DictionaryKey,
  NPCCode,
  isNPCObject,
} from "@bondage-academy/bondage-academy-model";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "../room/room-store-service";
import { ScriptService } from "../script/script-service";
import { SessionService } from "../session/session-service";
import { ChatService } from "./chat-service";

export class DialogueOptionService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private dialogueOptions: DialogueOption[],
    private roomStoreServie: RoomStoreService,
    private scriptService: ScriptService,
    private chatService: ChatService,
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
