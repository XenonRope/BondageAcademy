import {
  EventFromServer,
  Minigame,
  SynchronizeMinigamesEvent,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { RoomSessionService } from "../room/room-session-service";
import { Session } from "../session/model/session";
import { SessionService } from "../session/session-service";

@singleton()
export class MinigameClientSynchronizationService {
  constructor(
    @inject(RoomSessionService)
    private roomSessionService: RoomSessionService,
    @inject(SessionService)
    private sessionService: SessionService,
  ) {}

  async synchronizeMinigame(minigame: Minigame): Promise<void> {
    const sessions = await this.getSessions(minigame);
    this.synchronizeMinigames(sessions, {
      replaceMinigames: [minigame],
    });
  }

  async removeMinigame(minigame: Minigame): Promise<void> {
    const sessions = await this.getSessions(minigame);
    this.synchronizeMinigames(sessions, {
      removeMinigames: [minigame.id],
    });
  }

  synchronizeMinigames(
    sessions: Session[],
    event: SynchronizeMinigamesEvent,
  ): void {
    for (const session of sessions) {
      session.socket.emit(EventFromServer.SynchronizeMinigames, event);
    }
  }

  private async getSessions(minigame: Minigame): Promise<Session[]> {
    if (minigame.roomId) {
      return await this.roomSessionService.getSessionsInRoom(minigame.roomId);
    }
    return [minigame.actor, minigame.target]
      .filter(isPlayerActor)
      .map((playerActor) => playerActor.playerId)
      .map((playerId) => this.sessionService.getSessionByPlayerId(playerId))
      .flatMap((session) => (session ? [session] : []));
  }
}
