import assert from 'assert';

export class RingList<T> {
  protected list: T[] = [];
  protected size: number;
  protected insertIndex = 0;
  protected removeIndex = -1;

  constructor(size: number) {
    assert(size > 0, 'size must be greater than 0');
    this.size = size;
    this.list = Array(size);
  }

  add(item: T) {
    const rem = Math.abs(this.removeIndex - this.insertIndex);

    if (rem <= this.size) {
      const i = this.insertIndex % this.size;
      this.list[i] = item;
      this.insertIndex++;
      return true;
    }

    return false;
  }

  removeNext() {
    const removeIndex = this.removeIndex + 1;
    const rem = Math.abs(removeIndex - this.insertIndex);

    if (rem > 0) {
      const i = removeIndex % this.size;
      const item = this.list[i];
      this.removeIndex++;
      return item;
    }

    return undefined;
  }

  remaining() {
    const removeIndex = this.removeIndex + 1;
    return this.size - Math.abs(removeIndex - this.insertIndex);
  }

  values() {
    const removeIndex = this.removeIndex + 1;
    const start = removeIndex % this.size;
    const rem = Math.abs(removeIndex - this.insertIndex);
    const end = start + rem;
    return this.list.slice(start, end);
  }
}
