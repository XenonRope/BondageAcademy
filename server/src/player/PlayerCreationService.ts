import { sequences, type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { playerService, type PlayerService } from "./PlayerService";
import { type Player } from "./model/Player";

export interface PlayerCreateParams {
  name: string;
}

export class PlayerCreationService {
  constructor(
    private playerService: PlayerService,
    private sequences: Sequences
  ) {}

  async createPlayer(params: PlayerCreateParams): Promise<Player> {
    const id = await this.sequences.getNext(SequenceName.PLAYER);
    const player: Player = { id, name: params.name };
    await this.playerService.insertPlayer(player);

    return player;
  }
}

export const playerCreationService = new PlayerCreationService(
  playerService,
  sequences
);
