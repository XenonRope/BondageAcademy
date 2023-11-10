import { type Character } from "../../character/model/Character";
import { type Position } from "../../common/model/Position";

export interface Player {
  id: number;
  name: string;
  roomId: number;
  position: Position;
  character: Character;
}

export interface PlayerForClient {
  id: number;
  name: string;
  character: Character;
}

export const mapToPlayerForClient = (player: Player): PlayerForClient => {
  return {
    id: player.id,
    name: player.name,
    character: player.character,
  };
};
