import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { storeService, type StoreService } from "../store/StoreService";
import type { ServerResponse } from "./model/ServerResponse";

export class SocketService {
  constructor(private storeService: StoreService) {}

  connect(): Socket {
    return io("http://localhost:5173");
  }

  async emit<T>(event: string, data: unknown): Promise<T> {
    const response: ServerResponse<T> = await this.storeService
      .getStore()
      .socket!.emitWithAck(event, data);
    if (response.error != null) {
      throw new Error(response.error);
    }

    return response.data as T;
  }
}

export const socketService = new SocketService(storeService);
