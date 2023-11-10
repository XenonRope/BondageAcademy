import type { Character } from "../../character/model/Character";

export interface Player {
  id: number;
  name: string;
  character: Character;
}
