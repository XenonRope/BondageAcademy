import { Collection } from "mongodb";
import { inject, singleton } from "tsyringe";
import { Dao } from "./dao";
import { CollectionName } from "./model/collection-name";
import { Sequence } from "./model/sequence";
import { SequenceName } from "./model/sequence-name";

@singleton()
export class Sequences {
  private collection: Collection<Sequence>;

  constructor(@inject(Dao) dao: Dao) {
    this.collection = dao.getCollection(CollectionName.SEQUENCES);
  }

  async getNext(sequence: SequenceName): Promise<number> {
    const result = await this.collection.findOneAndUpdate(
      { id: sequence },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after" },
    );

    return result!.value;
  }
}
