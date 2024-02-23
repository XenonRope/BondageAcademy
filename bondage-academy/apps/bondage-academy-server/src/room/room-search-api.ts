import {
  SearchRoomRequestSchema,
  SearchRoomResponse,
} from "@bondage-academy/bondage-academy-model";
import * as tPromise from "io-ts-promise";
import { inject, singleton } from "tsyringe";
import { RoomSearchService } from "./room-search-service";

@singleton()
export class RoomSearchApi {
  constructor(
    @inject(RoomSearchService) private roomSearchService: RoomSearchService,
  ) {}

  async searchRooms(request: unknown): Promise<SearchRoomResponse> {
    const searchRoomsRequest = await tPromise.decode(
      SearchRoomRequestSchema,
      request,
    );
    return await this.roomSearchService.searchRooms(searchRoomsRequest);
  }
}
