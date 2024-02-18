import { Collection } from "mongodb";
import { Dao } from "./dao";
import { CollectionName } from "./model/collection-name";
import { Sequence } from "./model/sequence";
import { SequenceName } from "./model/sequence-name";

export class Sequences {
  private collection: Collection<Sequence>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.SEQUENCES);
  }

  async getNext(sequence: SequenceName): Promise<number> {
    const result = await this.collection.findOneAndUpdate(
      { id: sequence },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after" },
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result!.value;
  }
}
