import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { store } from "./Store";
import type { ServerResponse } from "./model/ServerResponse";

export class SocketService {
  connect(): Socket {
    return io("http://localhost:5173");
  }

  async emit<T>(event: string, data: unknown): Promise<T> {
    const response: ServerResponse<T> = await store.socket!.emitWithAck(
      event,
      data,
    );
    if (response.error) {
      throw new Error(response.error);
    }

    return response.data as T;
  }
}

export const socketService = new SocketService();
