import {
  Character,
  NPCCode,
  NPCObject,
  ObjectType,
  PlayerObject,
  Position,
} from "@bondage-academy/bondage-academy-model";
import { ObjectIdProvider } from "./object-id-provider";

export class ObjectCreationService {
  constructor(private objectIdProvider: ObjectIdProvider) {}

  async createPlayerObject({
    position,
    playerId,
  }: {
    position: Position;
    playerId: number;
  }): Promise<PlayerObject> {
    return {
      type: ObjectType.Player,
      id: await this.objectIdProvider.getNextId(),
      position,
      playerId,
    };
  }

  async createNPC({
    position,
    code,
    character,
  }: {
    position: Position;
    code: NPCCode;
    character: Character;
  }): Promise<NPCObject> {
    return {
      type: ObjectType.NPC,
      id: await this.objectIdProvider.getNextId(),
      position,
      code,
      character,
      items: [],
    };
  }
}
