export interface StoreEntry<T> {
  value?: T;
  promise: Promise<T>;
  lastRetrieved: Date;
  markedForSaving: boolean;
  pendingUpdates: number;
}

export abstract class Store<K, V> {
  private entries = new Map<K, StoreEntry<V>>();

  async get(key: K): Promise<V> {
    return await this.getEntry(key).promise;
  }

  update(key: K, updateFn: (value: V) => void): Promise<void> {
    const entry: StoreEntry<V> = this.getEntry(key);
    entry.pendingUpdates++;
    return entry.promise.then((value) => {
      updateFn(value);
      entry.markedForSaving = true;
      entry.pendingUpdates--;
    });
  }

  save(): V[] {
    const result: V[] = [];
    for (const entry of this.entries.values()) {
      if (entry.value && entry.markedForSaving) {
        result.push(entry.value);
        entry.markedForSaving = false;
      }
    }

    return result;
  }

  removeOldEntries(threshold: Date): void {
    for (const [key, entry] of this.entries) {
      if (
        entry.lastRetrieved < threshold &&
        entry.value &&
        !entry.markedForSaving &&
        entry.pendingUpdates === 0
      ) {
        this.entries.delete(key);
      }
    }
  }

  private getEntry(key: K): StoreEntry<V> {
    const entry = this.entries.get(key);
    if (entry != null) {
      entry.lastRetrieved = new Date();
      return entry;
    }
    const promise: Promise<V> = this.fetch(key);
    const newEntry: StoreEntry<V> = {
      promise,
      lastRetrieved: new Date(),
      markedForSaving: false,
      pendingUpdates: 0,
    };
    this.entries.set(key, newEntry);

    promise
      .then((value) => {
        newEntry.value = value;
      })
      .catch((error) => {
        this.entries.delete(key);
        console.log(`Error fetching store entry: ${error}`);
      });

    return newEntry;
  }

  protected abstract fetch(key: K): Promise<V>;
}
