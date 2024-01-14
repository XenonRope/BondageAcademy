import { GameObject } from "../model/game-object";
import { UpdateActor } from "./character";

export interface SynchronizeGameObjects {
  objects?: GameObject[];
  updateNPCs?: UpdateNPCObject[];
  toRemove?: number[];
}

export interface UpdateNPCObject extends UpdateActor {
  id: number;
}
