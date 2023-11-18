import type { Room, World } from "shared";
import { type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { type ObjectCreator } from "../object/ObjectCreator";

export class WorldCreationService {
  constructor(
    private sequences: Sequences,
    private worldObjectCreator: ObjectCreator
  ) {}

  async createWorld(room: Room): Promise<World> {
    return {
      id: await this.sequences.getNext(SequenceName.WORLD),
      roomId: room.id,
      name: room.name,
      customName: room.customName,
      persistent: room.persistent,
      width: room.width,
      height: room.height,
      transitAreas: room.transitAreas,
      restrictions: room.restrictions,
      objects: this.worldObjectCreator.createObjectsFromRoom(room),
    };
  }
}
