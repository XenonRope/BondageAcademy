import {
  CharacterPose,
  EquippedItem,
  Item,
  Player,
  Slot,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { PlayerService } from "./player-service";

@singleton()
export class PlayerStoreService {
  constructor(
    @inject(PlayerService)
    private playerService: PlayerService,
  ) {}

  async getPlayerName(playerId: number): Promise<string> {
    const player = await this.get(playerId);
    return player.name;
  }

  async getPlayerRoomId(playerId: number): Promise<number | undefined> {
    const player = await this.get(playerId);
    return player.roomId;
  }

  async getEquippedItem(
    playerId: number,
    slot: Slot,
  ): Promise<EquippedItem | undefined> {
    const player = await this.get(playerId);
    return player.character.wearables[slot];
  }

  async get(playerId: number): Promise<Player> {
    return await this.playerService.getPlayer(playerId);
  }

  async getPlayersByIds(playerIds: number[]): Promise<Player[]> {
    return await this.playerService.getPlayersByIds(playerIds);
  }

  async updateRoomId(playerId: number, roomId?: number): Promise<void> {
    await this.playerService.updateRoomId(playerId, roomId);
  }

  async updatePose(playerId: number, pose: CharacterPose): Promise<void> {
    await this.playerService.updatePose(playerId, pose);
  }

  async updateEquippedItem(
    playerId: number,
    slot: Slot,
    item?: EquippedItem,
  ): Promise<void> {
    await this.playerService.updateEquippedItem(playerId, slot, item);
  }

  async addItems(playerId: number, items: Item[]): Promise<void> {
    await this.playerService.addItems(playerId, items);
  }

  async removeItemById(playerId: number, itemId: number): Promise<void> {
    await this.playerService.removeItemById(playerId, itemId);
  }
}
