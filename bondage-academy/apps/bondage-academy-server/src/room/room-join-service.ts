import { Room } from "@bondage-academy/bondage-academy-model";
import { BusinessError } from "../api/model/business-error";
import { ObjectCreationService } from "../object/object-creation-service";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomFieldService } from "./room-field-service";
import { RoomObjectCreationService } from "./room-object-creation-service";
import { RoomStoreService } from "./room-store-service";

export class RoomJoinService {
  constructor(
    private roomStoreService: RoomStoreService,
    private roomFieldService: RoomFieldService,
    private objectCreationService: ObjectCreationService,
    private playerStoreService: PlayerStoreService,
    private roomObjectCreationService: RoomObjectCreationService
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
      (player) => (player.roomId = roomId)
    );
    const playerObject = await this.objectCreationService.createPlayerObject({
      position,
      playerId,
    });
    await this.roomObjectCreationService.createObject(roomId, playerObject);
  }

  private findFreeFieldInTransitArea(room: Room) {
    const position = this.roomFieldService.findFreeFieldInTransitArea(room);
    if (position == null) {
      throw new BusinessError("noFreePositionInTransitArea");
    }
    return position;
  }
}
