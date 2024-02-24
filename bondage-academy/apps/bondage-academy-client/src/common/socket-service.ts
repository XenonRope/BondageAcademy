import { ServerResponse } from "@bondage-academy/bondage-academy-model";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { inject, singleton } from "tsyringe";
import type { Store } from "../store/model/store";
import { STORE } from "../store/store-service";

@singleton()
export class SocketService {
  constructor(@inject(STORE) private store: Store) {}

  connect(): Socket {
    return io({ transports: ["websocket"] });
  }

  async emit<T>(event: string, data: unknown): Promise<T> {
    const response: ServerResponse<T> = await this.store.socket!.emitWithAck(
      event,
      data,
    );
    if (response.error != null) {
      throw new Error(response.error);
    }

    return response.data as T;
  }
}
