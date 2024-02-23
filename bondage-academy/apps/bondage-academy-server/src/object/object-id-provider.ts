import { inject, singleton } from "tsyringe";
import { SequenceName } from "../dao/model/sequence-name";
import { Sequences } from "../dao/sequences";

@singleton()
export class ObjectIdProvider {
  constructor(@inject(Sequences) private sequences: Sequences) {}

  async getNextId(): Promise<number> {
    return await this.sequences.getNext(SequenceName.OBJECT);
  }
}
