import { type Collection } from "mongodb";
import { type Dao } from "./Dao";
import { CollectionName } from "./model/CollectionName";
import { type Sequence } from "./model/Sequence";
import { type SequenceName } from "./model/SequenceName";

export class Sequences {
  private collection: Collection<Sequence>;

  constructor(dao: Dao) {
    this.collection = dao.getCollection(CollectionName.SEQUENCES);
  }

  async getNext(sequence: SequenceName): Promise<number> {
    const result = await this.collection.findOneAndUpdate(
      { id: sequence },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    return result!.value;
  }
}
