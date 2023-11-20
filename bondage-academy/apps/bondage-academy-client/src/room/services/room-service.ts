import {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  RequestFromClient,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";
import { StoreService } from "../../store/store-service";

export class RoomService {
  constructor(
    private socketService: SocketService,
    private storeService: StoreService
  ) {}

  async joinRoom(roomId: number): Promise<void> {
    const request: JoinRoomRequest = {
      roomId,
    };
    const response = await this.socketService.emit<JoinRoomResponse>(
      RequestFromClient.JoinRoom,
      request
    );
    this.storeService.setRoom(response.room);
    this.storeService.setPlayers(response.players);
  }

  async createRoom(roomCode: string): Promise<void> {
    const request: CreateRoomRequest = {
      roomCode,
    };
    const response = await this.socketService.emit<CreateRoomResponse>(
      RequestFromClient.CreateRoom,
      request
    );
    this.storeService.setRoom(response.room);
    this.storeService.setPlayers(response.players);
  }

  async leaveRoom(): Promise<void> {
    await this.socketService.emit(RequestFromClient.LeaveRoom, undefined);
    this.storeService.setRoom(undefined);
  }
}
