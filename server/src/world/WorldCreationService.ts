import { type Sequences } from "../common/Sequences";
import { SequenceName } from "../common/model/SequenceName";
import { type Room } from "../room/model/Room";
import { type WorldObjectCreator } from "./WorldObjectCreator";
import { type World } from "./model/World";

export class WorldCreationService {
  constructor(
    private sequences: Sequences,
    private worldObjectCreator: WorldObjectCreator
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
      objects: this.worldObjectCreator.createObjectsInRoom(room),
    };
  }
}
