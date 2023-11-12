export interface StoreEntry<T> {
  value: Promise<T>;
  lastRetrieved: Date;
}

export class Store<K, V> {
  private entries = new Map<K, StoreEntry<V>>();
  private fetch: (key: K) => Promise<V>;

  constructor(fetch: (key: K) => Promise<V>) {
    this.fetch = fetch;
  }

  async get(key: K): Promise<V> {
    const entry = this.entries.get(key);
    if (entry != null) {
      entry.lastRetrieved = new Date();
      return await entry.value;
    }
    const value: Promise<V> = this.fetch(key);
    this.entries.set(key, {
      value,
      lastRetrieved: new Date(),
    });

    return await value.catch((error) => {
      this.entries.delete(key);
      throw error;
    });
  }
}
