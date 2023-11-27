import * as t from "io-ts";
import { RoomSearchDetails, RoomState } from "../model/room";

export const JoinRoomRequestSchema = t.type({
  roomId: t.number,
});

export type JoinRoomRequest = t.TypeOf<typeof JoinRoomRequestSchema>;

export type JoinRoomResponse = {
  state: RoomState;
};

export const CreateRoomRequestSchema = t.type({
  roomCode: t.string,
  publicRoom: t.boolean,
  name: t.union([t.string, t.undefined]),
  description: t.union([t.string, t.undefined]),
});

export type CreateRoomRequest = t.TypeOf<typeof CreateRoomRequestSchema>;

export type CreateRoomResponse = {
  state: RoomState;
};

export const SearchRoomRequestSchema = t.type({
  name: t.string,
  skip: t.number,
  limit: t.number,
});

export type SearchRoomRequest = t.TypeOf<typeof SearchRoomRequestSchema>;

export type SearchRoomResponse = {
  rooms: RoomSearchDetails[];
  totalCount: number;
};
