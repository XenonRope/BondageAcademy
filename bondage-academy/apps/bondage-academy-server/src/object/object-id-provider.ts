import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";

export class ObjectIdProvider {
  constructor(private sequences: Sequences) {}

  async getNextId(): Promise<number> {
    return await this.sequences.getNext(SequenceName.OBJECT);
  }
}
