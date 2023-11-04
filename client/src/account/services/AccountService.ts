import { socketService, type SocketService } from "../../common/SocketService";
import type { Player } from "../../player/model/Player";

export interface AccountRegisterRequest {
  username: string;
  password: string;
  nick: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export class AccountService {
  constructor(private socketService: SocketService) {}

  async registerAccount(request: AccountRegisterRequest): Promise<void> {
    return await this.socketService.emit("register_account", request);
  }

  async login(request: LoginRequest): Promise<Player> {
    return await this.socketService.emit("login", request);
  }
}

export const accountService = new AccountService(socketService);
