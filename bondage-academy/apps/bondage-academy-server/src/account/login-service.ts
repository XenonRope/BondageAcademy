import { RoomCode } from "@bondage-academy/bondage-academy-model";
import { BusinessError } from "../api/model/business-error";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomCreationService } from "../room/room-creation-service";
import { RoomJoinService } from "../room/room-join-service";
import { RoomService } from "../room/room-service";
import type { Session } from "../session/model/session";
import type { SessionService } from "../session/session-service";
import { type AccountService } from "./account-service";
import { type LogoutService } from "./logout-service";

export class LoginService {
  constructor(
    private accountService: AccountService,
    private sessionService: SessionService,
    private logoutService: LogoutService,
    private playerStoreService: PlayerStoreService,
    private roomCreationService: RoomCreationService,
    private roomService: RoomService,
    private roomJoinService: RoomJoinService
  ) {}

  async login(
    session: Session,
    username: string,
    password: string
  ): Promise<{ playerId: number; roomId: number }> {
    const account = await this.accountService.getAccountByUsernameAndPassword(
      username,
      password
    );
    if (account == null) {
      throw new BusinessError("incorrectUsernameOrPassword");
    }

    const otherSessionForSamePlayer = this.sessionService.getSessionByPlayerId(
      account.playerId
    );
    if (otherSessionForSamePlayer != null) {
      this.logoutService.logout(otherSessionForSamePlayer);
    }

    session.accountId = account.id;
    session.playerId = account.playerId;

    const player = await this.playerStoreService.get(account.playerId);
    if (player.roomId != null) {
      return { playerId: player.id, roomId: player.roomId };
    }

    const templateRoomId = await this.roomService.getRoomIdByCode(
      RoomCode.Introduction
    );
    const room = await this.roomCreationService.createRoomFromTemplate({
      templateRoomId,
      restrictions: { players: [player.id] },
    });
    await this.roomJoinService.joinRoom(player.id, room.id);

    return { playerId: player.id, roomId: room.id };
  }
}
