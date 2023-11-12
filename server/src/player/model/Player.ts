import { type Character } from "../../character/model/Character";
import { type Position } from "../../common/model/Position";
import { type Item } from "../../item/model/Item";

export interface Player {
  id: number;
  name: string;
  roomId: number;
  position: Position;
  character: Character;
  items: Item[];
}

export interface PlayerForClient {
  id: number;
  name: string;
  character: Character;
  items: Item[];
}

export const mapToPlayerForClient = (player: Player): PlayerForClient => {
  return {
    id: player.id,
    name: player.name,
    character: player.character,
    items: player.items,
  };
};
