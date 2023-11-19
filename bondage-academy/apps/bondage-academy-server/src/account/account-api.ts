import {
  AccountRegisterRequest,
  LoginRequest,
  LoginResponse,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { requiredString } from "../api/utils/validators";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomStoreService } from "../room/room-store-service";
import { Session } from "../session/model/session";
import { AccountRegistrationService } from "./account-registration-service";
import { LoginService } from "./login-service";

export class AccountApi {
  constructor(
    private accountRegistrationService: AccountRegistrationService,
    private loginService: LoginService,
    private playerStoreService: PlayerStoreService,
    private roomStoreService: RoomStoreService
  ) {}

  async registerAccount({
    username,
    password,
    nick,
  }: AccountRegisterRequest): Promise<void> {
    requiredString(username, 3, 30, "invalidUsername");
    requiredString(password, 12, 100, "invalidPassword");
    requiredString(nick, 3, 20, "invalidNick");

    await this.accountRegistrationService.registerAccount({
      username,
      password,
      nick,
    });
  }

  async login(
    { username, password }: LoginRequest,
    session: Session
  ): Promise<LoginResponse> {
    requiredString(username, 3, 30, "invalidUsername");
    requiredString(password, 12, 100, "invalidPassword");

    const { playerId, roomId } = await this.loginService.login(
      session,
      username,
      password
    );

    const room = await this.roomStoreService.get(roomId);
    const playersIds = room.objects.flatMap((object) =>
      isPlayerObject(object) ? [object.playerId] : []
    );
    const players = await this.playerStoreService.getAll(playersIds);

    return {
      playerId,
      room,
      players,
    };
  }
}
