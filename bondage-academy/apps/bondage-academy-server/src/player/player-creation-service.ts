import {
  CharacterShape,
  CharacterSkin,
  HeadPose,
  LowerBodyPose,
  Player,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { ClientSession } from "mongodb";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";
import { PlayerService } from "./player-service";

export interface PlayerCreateParams {
  name: string;
}

export class PlayerCreationService {
  constructor(
    private playerService: PlayerService,
    private sequences: Sequences
  ) {}

  async createPlayer(
    params: PlayerCreateParams,
    session?: ClientSession
  ): Promise<Player> {
    const player: Player = {
      id: await this.sequences.getNext(SequenceName.PLAYER),
      name: params.name,
      character: {
        shape: CharacterShape.Shape1,
        skin: CharacterSkin.Skin1,
        wearables: {},
        pose: {
          upperBody: UpperBodyPose.Crossed,
          lowerBody: LowerBodyPose.Stand,
          head: HeadPose.Normal,
        },
      },
      items: [],
    };
    await this.playerService.insertPlayer(player, session);

    return player;
  }
}
