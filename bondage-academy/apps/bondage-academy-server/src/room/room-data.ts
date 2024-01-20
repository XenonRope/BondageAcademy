import { BlockObject } from "@bondage-academy/bondage-academy-model";

export interface RoomData {
  objects: Omit<BlockObject, "id">[];
}
