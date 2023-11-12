import { type Character } from "../../character/model/Character";
import { type Position } from "../../common/model/Position";
import { type Session } from "../../session/model/Session";
import {
  WorldObjectType,
  type WorldObject,
  type WorldObjectForClient,
} from "./WorldObject";

export interface PlayerObject extends WorldObject {
  type: WorldObjectType.Player;
  playerId: number;
  session: Session;
  targetPosition?: Position;
  motionEndEvent?: NodeJS.Timeout;
}

export interface PlayerObjectForClient extends WorldObjectForClient {
  type: WorldObjectType.Player;
  playerId: number;
  name: string;
  character: Character;
}

export const isPlayerObject = (object: WorldObject): object is PlayerObject => {
  return object.type === WorldObjectType.Player;
};
