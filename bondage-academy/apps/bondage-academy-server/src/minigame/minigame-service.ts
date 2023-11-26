import {
  Actor,
  Minigame,
  MinigameChallange,
  MinigameStake,
} from "@bondage-academy/bondage-academy-model";
import { MinigameChallangeService } from "./minigame-challange-service";
import { MinigameClientSynchronizationService } from "./minigame-client-synchronization-service";
import { MinigameStakeService } from "./minigame-stake-service";
import { MinigameWithState } from "./model/minigame-with-state";

export class MinigameService {
  private serverMinigames = new Map<number, MinigameWithState>();
  private nextMinigameId = 1;

  constructor(
    private minigameClientSynchronizationService: MinigameClientSynchronizationService,
    private minigameChallangeService: MinigameChallangeService,
    private minigameStakeService: MinigameStakeService
  ) {}

  getMinigamesByRoomId(roomId: number): Minigame[] {
    return Array.from(this.serverMinigames.values())
      .filter(({ minigame }) => minigame.roomId === roomId)
      .map(({ minigame }) => minigame);
  }

  async startMinigame(params: {
    roomId?: number;
    actor: Actor;
    target?: Actor;
    challange: MinigameChallange;
    stake: MinigameStake;
    durationInMs: number;
  }): Promise<void> {
    const minigameId = this.nextMinigameId++;
    const endTimeEvent = setTimeout(() => {
      this.handleTimeEnd(minigameId).catch(console.log);
    }, params.durationInMs);
    const serverMinigame: MinigameWithState = {
      minigame: {
        id: minigameId,
        roomId: params.roomId,
        actor: params.actor,
        target: params.target,
        challange: params.challange,
        stake: params.stake,
      },
      state: {
        endTimeEvent,
      },
    };
    this.serverMinigames.set(minigameId, serverMinigame);
    await this.minigameClientSynchronizationService.synchronizeMinigame(
      serverMinigame.minigame
    );
  }

  async removeMinigame(minigameId: number): Promise<void> {
    const minigameWithState = this.serverMinigames.get(minigameId);
    if (minigameWithState) {
      const { minigame, state } = minigameWithState;
      clearTimeout(state.endTimeEvent);
      this.serverMinigames.delete(minigameId);
      await this.minigameClientSynchronizationService.removeMinigame(minigame);
    }
  }

  private async handleTimeEnd(minigameId: number): Promise<void> {
    const minigameWithState = this.serverMinigames.get(minigameId);
    if (!minigameWithState) {
      return;
    }
    const { minigame } = minigameWithState;
    const result = await this.minigameChallangeService.getResultAfterTimeEnd(
      minigame
    );
    try {
      await this.minigameStakeService.executeStake(minigame, result);
    } finally {
      await this.removeMinigame(minigameId);
    }
  }
}
