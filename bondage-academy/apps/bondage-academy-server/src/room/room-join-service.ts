import { Room } from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { BusinessError } from "../api/model/business-error";
import { ObjectCreationService } from "../object/object-creation-service";
import { PlayerStoreService } from "../player/player-store-service";
import { ScriptService } from "../script/script-service";
import { RoomFieldService } from "./room-field-service";
import { RoomObjectCreationService } from "./room-object-creation-service";
import { RoomStoreService } from "./room-store-service";

@singleton()
export class RoomJoinService {
  constructor(
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
    @inject(RoomFieldService)
    private roomFieldService: RoomFieldService,
    @inject(ObjectCreationService)
    private objectCreationService: ObjectCreationService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomObjectCreationService)
    private roomObjectCreationService: RoomObjectCreationService,
    @inject(ScriptService)
    private scriptService: ScriptService,
  ) {}

  async joinRoom(playerId: number, roomId: number): Promise<void> {
    const player = await this.playerStoreService.get(playerId);
    if (player.roomId) {
      throw new Error("Player is already in a room");
    }
    const room = await this.roomStoreService.get(roomId);
    if (
      room.restrictions?.players &&
      !room.restrictions.players.includes(playerId)
    ) {
      throw new BusinessError("youAreNotAllowedToJoinThisRoom");
    }
    const position = this.findFreeFieldInTransitArea(room);

    await this.playerStoreService.update(
      playerId,
      (player) => (player.roomId = roomId),
    );
    const playerObject = await this.objectCreationService.createPlayerObject({
      position,
      playerId,
    });
    await this.roomObjectCreationService.createObject(roomId, playerObject);
    await this.scriptService.onPlayerJoinRoom({ playerId, roomId });
  }

  private findFreeFieldInTransitArea(room: Room) {
    const position = this.roomFieldService.findFreeFieldInTransitArea(room);
    if (position == null) {
      throw new BusinessError("noFreePositionInTransitArea");
    }
    return position;
  }
}
