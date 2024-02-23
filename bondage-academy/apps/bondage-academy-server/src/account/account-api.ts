import {
  AccountRegisterRequest,
  LoginRequest,
  LoginResponse,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { requiredString } from "../api/utils/validators";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomUtilsService } from "../room/room-utils-service";
import { Session } from "../session/model/session";
import { AccountRegistrationService } from "./account-registration-service";
import { LoginService } from "./login-service";

@singleton()
export class AccountApi {
  constructor(
    @inject(AccountRegistrationService)
    private accountRegistrationService: AccountRegistrationService,
    @inject(LoginService)
    private loginService: LoginService,
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(RoomUtilsService)
    private roomUtilsService: RoomUtilsService,
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
    session: Session,
  ): Promise<LoginResponse> {
    requiredString(username, 3, 30, "invalidUsername");
    requiredString(password, 12, 100, "invalidPassword");

    const { playerId } = await this.loginService.login(
      session,
      username,
      password,
    );

    const player = await this.playerStoreService.get(playerId);
    if (!player.roomId) {
      return {
        playerId,
        players: [player],
        minigames: [],
      };
    }

    const { room, players, minigames } =
      await this.roomUtilsService.getRoomState(player.roomId);
    return {
      playerId,
      room,
      players,
      minigames,
    };
  }
}
