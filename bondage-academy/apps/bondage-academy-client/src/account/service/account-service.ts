import {
  AccountRegisterRequest,
  LoginRequest,
  LoginResponse,
} from "@bondage-academy/bondage-academy-model";
import { type SocketService } from "../../common/socket-service";
import type { StoreService } from "../../store/store-service";

export class AccountService {
  constructor(
    private socketService: SocketService,
    private storeService: StoreService
  ) {}

  async registerAccount(request: AccountRegisterRequest): Promise<void> {
    await this.socketService.emit("register_account", request);
  }

  async login(request: LoginRequest): Promise<void> {
    const response: LoginResponse = await this.socketService.emit(
      "login",
      request
    );
    this.storeService.setPlayerId(response.playerId);
    this.storeService.setRoom(response.room);
    this.storeService.setPlayers(response.players);
    this.storeService.setMinigames(response.minigames);
  }
}
