import { type Position } from "../../common/model/Position";

export interface Player {
  id: number;
  name: string;
  roomId: number;
  position: Position;
}

export interface PlayerForClient {
  id: number;
  name: string;
  roomId: number;
  position: Position;
}

export const mapToPlayerForClient = (player: Player): PlayerForClient => {
  return {
    id: player.id,
    name: player.name,
    roomId: player.roomId,
    position: player.position,
  };
};
