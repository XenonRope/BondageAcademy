import { inject, singleton } from "tsyringe";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";

@singleton()
export class ItemIdProvider {
  constructor(@inject(Sequences) private sequences: Sequences) {}

  async getNext(): Promise<number> {
    return await this.sequences.getNext(SequenceName.ITEM);
  }
}
