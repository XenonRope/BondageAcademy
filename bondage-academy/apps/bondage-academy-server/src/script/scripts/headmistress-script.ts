import {
  ItemCode,
  LowerBodyPose,
  NPCCode,
  RoomCode,
  isStandardCharacterPose,
} from "@bondage-academy/bondage-academy-model";
import { ChatService } from "../../chat/chat-service";
import { ItemService } from "../../item/item-service";
import { PlayerStoreService } from "../../player/player-store-service";
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
    private chatService: ChatService,
    private playerStoreService: PlayerStoreService,
    private itemService: ItemService
  ) {
    super();
  }

  register(eventEmitters: ScriptEventEmitters): void {
    eventEmitters.onPlayerJoinRoom.push(this.sayHello.bind(this));
    eventEmitters.onDialogueOptionUse.push(this.introduceYourself.bind(this));
    eventEmitters.onDialogueOptionUse.push(this.giveClothes.bind(this));
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
        speaker: { dictionaryKey: "npc.headmistress" },
        content: { dictionaryKey: "dialogue.welcomeInOurAcademy" },
      });
    }
  }

  private introduceYourself(event: DialogueOptionUseEvent): Promise<void> {
    if (
      event.npcCode !== NPCCode.Headmistress ||
      event.content !== "dialogue.whoAreYou"
    ) {
      return Promise.resolve();
    }
    const session = this.sessionService.getSessionByPlayerId(event.playerId);
    if (!session) {
      return Promise.resolve();
    }
    this.chatService.sendChatMessage([session], {
      speaker: { dictionaryKey: "npc.headmistress" },
      content: { dictionaryKey: "dialogue.iAmHeadmistressOfThisAcademy" },
    });
    return Promise.resolve();
  }

  private async giveClothes(event: DialogueOptionUseEvent): Promise<void> {
    if (
      event.npcCode !== NPCCode.Headmistress ||
      event.content !== "dialogue.iNeedClothes"
    ) {
      return;
    }
    const session = this.sessionService.getSessionByPlayerId(event.playerId);
    if (!session) {
      return;
    }
    const player = await this.playerStoreService.get(event.playerId);
    const lowerBodyPose = isStandardCharacterPose(player.character.pose)
      ? player.character.pose.lowerBody
      : undefined;
    if (
      lowerBodyPose &&
      [LowerBodyPose.SimpleKneel, LowerBodyPose.WideKneel].includes(
        lowerBodyPose
      )
    ) {
      this.chatService.sendChatMessage([session], {
        speaker: { dictionaryKey: "npc.headmistress" },
        content: { dictionaryKey: "dialogue.iHaveSomethingSuitableForYouHere" },
      });
      await this.itemService.addItemsToPlayer(event.playerId, [
        { code: ItemCode.XFashionSleeve },
        { code: ItemCode.MagicChristmasGlove },
        { code: ItemCode.HalleyHair1 },
        { code: ItemCode.XFashionThong },
        { code: ItemCode.BeccaMeshBra },
        { code: ItemCode.BeccaMeshBra },
        { code: ItemCode.CynthiaHighHeels },
        { code: ItemCode.BallGag },
        { code: ItemCode.NipplePiercingSphere },
        { code: ItemCode.NipplePiercingSpider },
        { code: ItemCode.NipplePiercingCShape },
        { code: ItemCode.NipplePiercingOrnament },
        { code: ItemCode.NipplePiercingMoon },
      ]);
    } else {
      this.chatService.sendChatMessage([session], {
        speaker: { dictionaryKey: "npc.headmistress" },
        content: { dictionaryKey: "dialogue.kneelIfYouWantToAskMeForFavor" },
      });
    }
  }
}
