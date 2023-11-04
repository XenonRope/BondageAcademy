import { type Position } from "../../common/model/Position";
import { type Player } from "../../player/model/Player";
import { type Session } from "../../session/model/Session";
import {
  WorldObjectType,
  type WorldObject,
  type WorldObjectForClient,
} from "./WorldObject";

export interface PlayerObject extends WorldObject {
  type: WorldObjectType.Player;
  player: Player;
  session: Session;
  targetPosition?: Position;
}

export interface PlayerObjectForClient extends WorldObjectForClient {
  type: WorldObjectType.Player;
  playerId: number;
  name: string;
}

export const isPlayerObject = (object: WorldObject): object is PlayerObject => {
  return object.type === WorldObjectType.Player;
};
