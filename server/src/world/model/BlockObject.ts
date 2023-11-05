import { type BlockColor } from "../../room/model/objects/BlockRoomObject";
import {
  WorldObjectType,
  type WorldObject,
  type WorldObjectForClient,
} from "./WorldObject";

export interface BlockObject extends WorldObject {
  type: WorldObjectType.Block;
  color: BlockColor;
}

export interface BlockObjectForClient extends WorldObjectForClient {
  type: WorldObjectType.Block;
  color: BlockColor;
}

export const isBlockObject = (object: WorldObject): object is BlockObject => {
  return object.type === WorldObjectType.Block;
};
