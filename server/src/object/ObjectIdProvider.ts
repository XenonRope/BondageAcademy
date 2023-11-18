export class ObjectIdProvider {
  private nextObjectId = 1;

  getNextId(): number {
    return this.nextObjectId++;
  }
}
