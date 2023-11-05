export class WorldObjectIdProvider {
  private nextObjectId = 1;

  getNextId(): number {
    return this.nextObjectId++;
  }
}

export const worldObjectIdProvider = new WorldObjectIdProvider();
