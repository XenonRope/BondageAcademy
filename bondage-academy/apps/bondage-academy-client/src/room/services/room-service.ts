import {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  RequestFromClient,
  SearchRoomRequest,
  SearchRoomResponse,
} from "@bondage-academy/bondage-academy-model";
import { SocketService } from "../../common/socket-service";
import { StoreService } from "../../store/store-service";

export class RoomService {
  constructor(
    private socketService: SocketService,
    private storeService: StoreService
  ) {}

  async joinRoom(roomId: number): Promise<void> {
    this.storeService.clearChatMessages();
    const request: JoinRoomRequest = {
      roomId,
    };
    const response = await this.socketService.emit<JoinRoomResponse>(
      RequestFromClient.JoinRoom,
      request
    );
    this.storeService.setRoom(response.state.room);
    this.storeService.setPlayers(response.state.players);
    this.storeService.setMinigames(response.state.minigames);
  }

  async createRoom(params: {
    roomCode: string;
    name?: string;
    description?: string;
    publicRoom: boolean;
  }): Promise<void> {
    this.storeService.clearChatMessages();
    const request: CreateRoomRequest = {
      roomCode: params.roomCode,
      name: params.name,
      description: params.description,
      publicRoom: params.publicRoom,
    };
    const response = await this.socketService.emit<CreateRoomResponse>(
      RequestFromClient.CreateRoom,
      request
    );
    this.storeService.setRoom(response.state.room);
    this.storeService.setPlayers(response.state.players);
    this.storeService.setMinigames(response.state.minigames);
  }

  async leaveRoom(): Promise<void> {
    await this.socketService.emit(RequestFromClient.LeaveRoom, undefined);
    this.storeService.setRoom(undefined);
    this.storeService.clearChatMessages();
    this.storeService.selectActor(undefined);
    this.storeService.setMinigames(undefined);
  }

  async searchRooms(request: SearchRoomRequest): Promise<SearchRoomResponse> {
    return await this.socketService.emit(RequestFromClient.SearchRoom, request);
  }
}
