import type { ClientSession } from "mongodb";
import {
  CharacterShape,
  CharacterSkin,
  HeadPose,
  LowerBodyPose,
  RoomCode,
  UpperBodyPose,
  type Player,
} from "shared";
import { type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { type RoomService } from "../room/RoomService";
import { type PlayerService } from "./PlayerService";

export interface PlayerCreateParams {
  name: string;
}

export class PlayerCreationService {
  constructor(
    private playerService: PlayerService,
    private roomService: RoomService,
    private sequences: Sequences
  ) {}

  async createPlayer(
    params: PlayerCreateParams,
    session?: ClientSession
  ): Promise<Player> {
    const id = await this.sequences.getNext(SequenceName.PLAYER);
    const roomId = await this.roomService.getRoomIdByCode(
      RoomCode.Introduction
    );
    const player: Player = {
      id,
      name: params.name,
      roomId: roomId!,
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
