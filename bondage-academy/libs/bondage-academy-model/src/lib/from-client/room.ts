import * as t from "io-ts";
import { Player } from "../model/player";
import { Room, RoomSearchDetails } from "../model/room";

export const JoinRoomRequestSchema = t.type({
  roomId: t.number,
});

export type JoinRoomRequest = t.TypeOf<typeof JoinRoomRequestSchema>;

export type JoinRoomResponse = {
  room: Room;
  players: Player[];
};

export const CreateRoomRequestSchema = t.type({
  roomCode: t.string,
  publicRoom: t.boolean,
  name: t.union([t.string, t.undefined]),
  description: t.union([t.string, t.undefined]),
});

export type CreateRoomRequest = t.TypeOf<typeof CreateRoomRequestSchema>;

export type CreateRoomResponse = {
  room: Room;
  players: Player[];
};

export const SearchRoomRequestSchema = t.type({
  name: t.string,
});

export type SearchRoomRequest = t.TypeOf<typeof SearchRoomRequestSchema>;

export type SearchRoomResponse = {
  rooms: RoomSearchDetails[];
};
