import {
  Action,
  ActionType,
  Actor,
  SmileAction,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ChatService } from "../../chat/chat-service";
import { PlayerStoreService } from "../../player/player-store-service";
import { RoomSessionService } from "../../room/room-session-service";
import { ActionHandler } from "./action-handler";

@singleton()
export class SmileActionHandler implements ActionHandler<SmileAction> {
  constructor(
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(ChatService)
    private chatService: ChatService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
  ) {}

  canHandle(action: Action): action is SmileAction {
    return action.type === ActionType.Smile;
  }

  async handle(actor: Actor, _action: SmileAction): Promise<void> {
    if (!isPlayerActor(actor)) {
      return;
    }

    const sessions = await this.roomSessionService.getSessionsInRoomOfPlayer(
      actor.playerId,
    );
    this.chatService.sendChatMessage(sessions, {
      action: true,
      content: {
        dictionaryKey: "action.smile.smiles",
        params: {
          actor: (await this.playerStoreService.get(actor.playerId)).name,
        },
      },
    });
  }
}
