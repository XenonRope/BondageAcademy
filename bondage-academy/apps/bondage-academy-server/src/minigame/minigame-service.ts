import {
  Actor,
  Minigame,
  MinigameChallange,
  MinigameStake,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { MinigameChallangeService } from "./minigame-challange-service";
import { MinigameClientSynchronizationService } from "./minigame-client-synchronization-service";
import { MinigameStakeService } from "./minigame-stake-service";
import { MinigameProgressChange } from "./model/minigame-progress-change";
import { MinigameWithState } from "./model/minigame-with-state";

export class MinigameService {
  private minigamesWithStates = new Map<number, MinigameWithState>();
  private nextMinigameId = 1;

  constructor(
    private minigameClientSynchronizationService: MinigameClientSynchronizationService,
    private minigameChallangeService: MinigameChallangeService,
    private minigameStakeService: MinigameStakeService
  ) {}

  assertPlayerIsNotDuringMinigame(playerId: number) {
    if (this.getMinigamesByPlayerId(playerId).length !== 0) {
      throw new Error(`Player ${playerId} is during minigame`);
    }
  }

  getMinigame(id: number): Minigame {
    const minigameWithState = this.minigamesWithStates.get(id);
    if (!minigameWithState) {
      throw new Error(`Minigame with id ${id} not found`);
    }
    return minigameWithState.minigame;
  }

  getMinigamesByRoomId(roomId: number): Minigame[] {
    return Array.from(this.minigamesWithStates.values())
      .filter(({ minigame }) => minigame.roomId === roomId)
      .map(({ minigame }) => minigame);
  }

  getMinigamesByPlayerId(playerId: number): Minigame[] {
    return Array.from(this.minigamesWithStates.values())
      .map(({ minigame }) => minigame)
      .filter(
        (minigame) =>
          (isPlayerActor(minigame.actor) &&
            minigame.actor.playerId === playerId) ||
          (isPlayerActor(minigame.target) &&
            minigame.target.playerId === playerId)
      );
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
    this.minigamesWithStates.set(minigameId, serverMinigame);
    await this.minigameClientSynchronizationService.synchronizeMinigame(
      serverMinigame.minigame
    );
  }

  async changeProgess(
    minigame: Minigame,
    progressChange: MinigameProgressChange
  ): Promise<void> {
    const result = await this.minigameChallangeService.changeProgress(
      minigame,
      progressChange
    );
    if (!result) {
      return;
    }
    try {
      await this.minigameStakeService.executeStake(minigame, result);
    } finally {
      await this.removeMinigame(minigame.id);
    }
  }

  async removeMinigame(minigameId: number): Promise<void> {
    const minigameWithState = this.minigamesWithStates.get(minigameId);
    if (minigameWithState) {
      const { minigame, state } = minigameWithState;
      clearTimeout(state.endTimeEvent);
      this.minigamesWithStates.delete(minigameId);
      await this.minigameClientSynchronizationService.removeMinigame(minigame);
    }
  }

  private async handleTimeEnd(minigameId: number): Promise<void> {
    const minigameWithState = this.minigamesWithStates.get(minigameId);
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
