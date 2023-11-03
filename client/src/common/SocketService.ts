import io, { Socket } from "socket.io-client";

class SocketService {
  private socket?: Socket;

  initialize = () => {
    this.socket = io("http://localhost:5173");
  };
}

export const socketService = new SocketService();
