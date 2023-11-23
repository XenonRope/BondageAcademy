import { NPCCode, RoomCode } from "@bondage-academy/bondage-academy-model";
import { ChatService } from "../../chat/chat-service";
import { RoomStoreService } from "../../room/room-store-service";
import { SessionService } from "../../session/session-service";
import {
  DialogueOptionUseEvent,
  PlayerJoinRoomEvent,
  ScriptEventEmitters,
} from "../model/script-event";
import { GameScript } from "./game-script";

export class HeadmistressScript extends GameScript {
  constructor(
    private roomStoreService: RoomStoreService,
    private sessionService: SessionService,
    private chatService: ChatService
  ) {
    super();
  }

  register(eventEmitters: ScriptEventEmitters): void {
    eventEmitters.onPlayerJoinRoom.push(this.sayHello.bind(this));
    eventEmitters.onDialogueOptionUse.push(this.introduceYourself.bind(this));
  }

  private async sayHello(event: PlayerJoinRoomEvent): Promise<void> {
    const session = this.sessionService.getSessionByPlayerId(event.playerId);
    if (!session) {
      return;
    }
    const room = await this.roomStoreService.get(event.roomId);
    if (!room.templateRoomId) {
      return;
    }
    const templateRoom = await this.roomStoreService.get(room.templateRoomId);
    if (templateRoom.code === RoomCode.Introduction) {
      this.chatService.sendChatMessage([session], {
        time: new Date().getTime(),
        speakerDictionaryKey: "npc.headmistress",
        contentDictionaryKey: "dialogue.welcomeInOurAcademy",
      });
    }
  }

  private introduceYourself(event: DialogueOptionUseEvent): Promise<void> {
    if (event.npcCode !== NPCCode.Headmistress) {
      return Promise.resolve();
    }
    const session = this.sessionService.getSessionByPlayerId(event.playerId);
    if (!session) {
      return Promise.resolve();
    }
    this.chatService.sendChatMessage([session], {
      time: new Date().getTime(),
      speakerDictionaryKey: "npc.headmistress",
      contentDictionaryKey: "dialogue.iAmHeadmistressOfThisAcademy",
    });
    return Promise.resolve();
  }
}
