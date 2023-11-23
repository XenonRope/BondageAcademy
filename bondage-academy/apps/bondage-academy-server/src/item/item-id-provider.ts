import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";

export class ItemIdProvider {
  constructor(private sequences: Sequences) {}

  async getNext(): Promise<number> {
    return await this.sequences.getNext(SequenceName.ITEM);
  }
}
