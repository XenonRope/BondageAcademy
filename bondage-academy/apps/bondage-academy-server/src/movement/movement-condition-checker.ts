import { inject, singleton } from "tsyringe";
import { MinigameService } from "../minigame/minigame-service";
import { RoomStoreService } from "../room/room-store-service";

@singleton()
export class MovementConditionChecker {
  constructor(
    @inject(MinigameService)
    private minigameService: MinigameService,
    @inject(RoomStoreService)
    private roomStoreService: RoomStoreService,
  ) {}

  async canObjectMove(roomId: number, objectId: number): Promise<boolean> {
    const playerId = await this.roomStoreService.getPlayerIdByObjectId(
      roomId,
      objectId,
    );
    return !!playerId && this.canPlayerMove(playerId);
  }

  private canPlayerMove(playerId: number): boolean {
    return this.minigameService.getMinigamesByPlayerId(playerId).length === 0;
  }
}
