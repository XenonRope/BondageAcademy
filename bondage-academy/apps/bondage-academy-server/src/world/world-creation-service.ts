import { Room, World } from "@bondage-academy/bondage-academy-model";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";
import { ObjectCreator } from "../object/object-creator";

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
