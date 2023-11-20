import * as t from "io-ts";
import { Player } from "../model/player";
import { Room } from "../model/room";

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
});

export type CreateRoomRequest = t.TypeOf<typeof CreateRoomRequestSchema>;

export type CreateRoomResponse = {
  room: Room;
  players: Player[];
};
